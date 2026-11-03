from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.api.v1.projects import verify_project_access
from app.models.entities import User, AgentRun, AgentStep

router = APIRouter(prefix="/observability", tags=["Observability"])

@router.get("/metrics")
async def get_observability_metrics(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await verify_project_access(project_id, current_user, db)
    runs_query = await db.execute(select(AgentRun).where(AgentRun.project_id == project_id))
    runs = runs_query.scalars().all()

    total_runs = len(runs)
    total_tokens = sum(r.total_tokens for r in runs)
    total_cost = sum(r.estimated_cost_usd for r in runs)
    avg_duration_sec = (sum(r.execution_time_ms for r in runs) / max(1, total_runs)) / 1000.0
    successful_runs = sum(1 for r in runs if r.status in ("COMPLETED", "WAITING_FOR_APPROVAL", "SUCCESS"))
    success_rate = round((successful_runs / total_runs * 100.0), 1) if total_runs > 0 else 100.0

    return {
        "total_agent_runs": total_runs,
        "total_tokens_consumed": total_tokens,
        "total_estimated_cost_usd": round(total_cost, 4),
        "average_run_duration_sec": round(avg_duration_sec, 2),
        "active_models": ["gemini-2.5-flash", "gpt-4o", "claude-3-5-sonnet"],
        "success_rate_percent": success_rate
    }
