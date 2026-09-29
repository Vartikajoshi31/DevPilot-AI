from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.entities import User, Bug
from app.schemas.schemas import BugCreate, BugOut

router = APIRouter(prefix="/bugs", tags=["Bugs"])

@router.get("", response_model=List[BugOut])
async def list_bugs(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Bug).where(Bug.project_id == project_id).order_by(Bug.created_at.desc()))
    return query.scalars().all()

@router.post("", response_model=BugOut)
async def create_bug(bug_in: BugCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    count_query = await db.execute(select(Bug).where(Bug.project_id == bug_in.project_id))
    total = len(count_query.scalars().all()) + 101

    bug = Bug(
        project_id=bug_in.project_id,
        bug_number=f"BUG-{total}",
        title=bug_in.title,
        description=bug_in.description,
        severity=bug_in.severity,
        environment=bug_in.environment,
        status="OPEN"
    )
    db.add(bug)
    await db.commit()
    await db.refresh(bug)
    return bug
