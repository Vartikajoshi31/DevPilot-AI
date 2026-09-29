from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.entities import User, SecurityFinding
from app.schemas.schemas import SecurityFindingOut

router = APIRouter(prefix="/security", tags=["Security"])

@router.get("", response_model=List[SecurityFindingOut])
async def list_security_findings(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(SecurityFinding).where(SecurityFinding.project_id == project_id))
    return query.scalars().all()
