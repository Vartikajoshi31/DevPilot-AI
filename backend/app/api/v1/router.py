from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as projects_router
from app.api.v1.agent_runs import router as agent_runs_router
from app.api.v1.bugs import router as bugs_router
from app.api.v1.tests import router as tests_router
from app.api.v1.security import router as security_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.observability import router as observability_router
from app.api.v1.analytics import router as analytics_router

api_v1_router = APIRouter()
api_v1_router.include_router(auth_router)
api_v1_router.include_router(projects_router)
api_v1_router.include_router(agent_runs_router)
api_v1_router.include_router(bugs_router)
api_v1_router.include_router(tests_router)
api_v1_router.include_router(security_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(observability_router)
api_v1_router.include_router(analytics_router)
