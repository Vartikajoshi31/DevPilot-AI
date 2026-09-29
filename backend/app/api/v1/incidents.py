from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.entities import User, Incident
from app.schemas.schemas import IncidentOut

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentOut])
async def list_incidents(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Incident).where(Incident.project_id == project_id))
    return query.scalars().all()
