from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.entities import User

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/costs")
async def get_cost_analytics(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {
        "today_usd": 4.21,
        "this_month_usd": 118.42,
        "by_agent": {
            "Planner Agent": 18.20,
            "Coding Agent": 49.50,
            "Code Review Agent": 21.10,
            "Debug Agent": 29.62
        },
        "daily_trend": [
            {"date": "2026-09-23", "cost": 12.4},
            {"date": "2026-09-24", "cost": 18.9},
            {"date": "2026-09-25", "cost": 15.2},
            {"date": "2026-09-26", "cost": 22.1},
            {"date": "2026-09-27", "cost": 25.8},
            {"date": "2026-09-28", "cost": 19.8},
            {"date": "2026-09-29", "cost": 4.21}
        ]
    }

@router.get("/engineering-health")
async def get_engineering_health(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {
        "code_quality_score": 92.5,
        "test_coverage_percent": 88.4,
        "security_score": 95.0,
        "dependency_health_score": 84.0,
        "ci_stability_percent": 98.2,
        "documentation_coverage_percent": 86.0,
        "technical_debt_hours": 14.5
    }
