from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.entities import User, TestCase

router = APIRouter(prefix="/tests", tags=["Tests"])

@router.get("")
async def list_test_cases(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(TestCase).where(TestCase.project_id == project_id))
    cases = query.scalars().all()
    return [
        {
            "id": tc.id,
            "test_number": tc.test_number,
            "title": tc.title,
            "category": tc.category,
            "priority": tc.priority,
            "expected_result": tc.expected_result,
            "status": tc.status,
            "created_at": tc.created_at
        } for tc in cases
    ]
