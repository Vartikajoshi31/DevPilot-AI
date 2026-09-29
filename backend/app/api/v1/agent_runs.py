import asyncio
from typing import List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db, AsyncSessionLocal
from app.api.v1.auth import get_current_user
from app.models.entities import User, AgentRun, AgentStep, AgentMessage, Approval
from app.schemas.schemas import AgentRunCreate, AgentRunOut, ApprovalAction
from app.agents.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/agent-runs", tags=["Agent Runs"])

# Active WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, run_id: str, websocket: WebSocket):
        await websocket.accept()
        if run_id not in self.active_connections:
            self.active_connections[run_id] = []
        self.active_connections[run_id].append(websocket)

    def disconnect(self, run_id: str, websocket: WebSocket):
        if run_id in self.active_connections:
            if websocket in self.active_connections[run_id]:
                self.active_connections[run_id].remove(websocket)

    async def broadcast(self, run_id: str, message: dict):
        if run_id in self.active_connections:
            for connection in self.active_connections[run_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

ws_manager = ConnectionManager()

@router.get("", response_model=List[AgentRunOut])
async def list_agent_runs(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = await db.execute(
        select(AgentRun)
        .options(
            selectinload(AgentRun.steps),
            selectinload(AgentRun.messages),
            selectinload(AgentRun.approvals)
        )
        .where(AgentRun.project_id == project_id)
        .order_by(AgentRun.created_at.desc())
    )
    return query.scalars().all()

@router.post("", response_model=AgentRunOut)
async def create_agent_run(
    run_in: AgentRunCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    agent_run = AgentRun(
        project_id=run_in.project_id,
        user_id=current_user.id,
        prompt=run_in.prompt,
        workflow_type=run_in.workflow_type,
        status="PLANNING",
        current_agent="Orchestrator"
    )
    db.add(agent_run)
    await db.commit()
    await db.refresh(agent_run)

    # Launch agent orchestrator in background task
    async def run_in_background(run_id: str):
        async with AsyncSessionLocal() as bg_db:
            async def broadcaster(msg: dict):
                await ws_manager.broadcast(run_id, msg)
            await AgentOrchestrator.run_workflow(bg_db, run_id, broadcast_callback=broadcaster)

    asyncio.create_task(run_in_background(agent_run.id))

    # Fetch updated record
    query = await db.execute(
        select(AgentRun)
        .options(
            selectinload(AgentRun.steps),
            selectinload(AgentRun.messages),
            selectinload(AgentRun.approvals)
        )
        .where(AgentRun.id == agent_run.id)
    )
    return query.scalar_one()

@router.get("/{run_id}", response_model=AgentRunOut)
async def get_agent_run(run_id: str, db: AsyncSession = Depends(get_db)):
    query = await db.execute(
        select(AgentRun)
        .options(
            selectinload(AgentRun.steps),
            selectinload(AgentRun.messages),
            selectinload(AgentRun.approvals)
        )
        .where(AgentRun.id == run_id)
    )
    run_obj = query.scalar_one_or_none()
    if not run_obj:
        raise HTTPException(status_code=404, detail="Agent run not found")
    return run_obj

@router.post("/approvals/{approval_id}/action")
async def resolve_approval(
    approval_id: str,
    action: ApprovalAction,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    app_query = await db.execute(select(Approval).where(Approval.id == approval_id))
    approval = app_query.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    approval.status = "APPROVED" if action.approved else "REJECTED"
    approval.reviewed_by = current_user.full_name or current_user.email

    run_query = await db.execute(select(AgentRun).where(AgentRun.id == approval.agent_run_id))
    agent_run = run_query.scalar_one_or_none()
    if agent_run:
        if action.approved:
            agent_run.status = "COMPLETED"
            agent_run.summary_result = "Human approved Pull Request creation. Simulated PR #42 submitted to GitHub repository."
        else:
            agent_run.status = "FAILED"
            agent_run.summary_result = f"Human rejected approval: {action.comments or 'No reason provided'}"

    await db.commit()
    
    await ws_manager.broadcast(approval.agent_run_id, {
        "type": "approval_resolved",
        "approval_id": approval_id,
        "status": approval.status
    })

    return {"status": "success", "approval_status": approval.status}

@router.websocket("/{run_id}/ws")
async def websocket_agent_stream(websocket: WebSocket, run_id: str):
    await ws_manager.connect(run_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(run_id, websocket)
