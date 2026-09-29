import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.entities import (
    User, Membership, Project, Repository, Bug, TestCase, SecurityFinding, Incident
)
from app.schemas.schemas import ProjectCreate, ProjectOut
from app.rag.indexer import RepositoryIndexer

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
async def list_projects(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    mem_query = await db.execute(select(Membership).where(Membership.user_id == current_user.id))
    membership = mem_query.scalars().first()
    if not membership:
        return []
        
    projects_query = await db.execute(select(Project).where(Project.organization_id == membership.organization_id))
    return projects_query.scalars().all()

@router.post("", response_model=ProjectOut)
async def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    mem_query = await db.execute(select(Membership).where(Membership.user_id == current_user.id))
    membership = mem_query.scalars().first()
    if not membership:
        raise HTTPException(status_code=400, detail="User does not belong to an organization")

    project = Project(
        organization_id=membership.organization_id,
        name=project_in.name,
        description=project_in.description or "DevPilot AI Managed Project",
        is_demo=project_in.is_demo
    )
    db.add(project)
    await db.flush()

    if project_in.is_demo:
        # Create Demo Repository & Index it immediately
        sample_repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "demo", "sample_repo"))
        repo = Repository(
            project_id=project.id,
            name="demo-ecommerce-service",
            full_name="devpilot-demo/ecommerce-service",
            default_branch="main",
            status="indexing",
            language="Python"
        )
        db.add(repo)
        await db.flush()

        # Seed Demo Bug
        bug = Bug(
            project_id=project.id,
            bug_number="BUG-101",
            title="Users are getting logged out after refreshing the dashboard",
            description="Session token expires immediately because expires_at is set to 0 in SessionStore.create_session()",
            severity="HIGH",
            status="OPEN",
            environment="Production",
            affected_files=["src/auth.py", "tests/test_auth.py"],
            root_cause="Premature token expiration",
            suggested_fix="Update session expires_at TTL to time.time() + 86400"
        )
        db.add(bug)

        # Seed Demo Security Finding
        sec = SecurityFinding(
            project_id=project.id,
            title="Hardcoded API Secret Key in Configuration",
            category="Secrets",
            severity="HIGH",
            file_path="src/config.py",
            line_number=4,
            description="Hardcoded API_SECRET_KEY string detected in source file.",
            remediation="Move API_SECRET_KEY to environment variable."
        )
        db.add(sec)

        # Seed Demo Test Case
        tc = TestCase(
            project_id=project.id,
            test_number="TC-201",
            title="Session Persistence After Dashboard Refresh",
            category="Regression",
            priority="P0",
            expected_result="User remains authenticated after refreshing dashboard page",
            status="FAILED"
        )
        db.add(tc)

        # Seed Demo Incident
        inc = Incident(
            project_id=project.id,
            incident_number="INC-402",
            title="Spike in premature user session logout errors",
            severity="SEV-2",
            status="INVESTIGATING",
            service="Auth Microservice",
            summary="Multiple user reports indicating unexpected logouts upon navigating or refreshing dashboard."
        )
        db.add(inc)

        await db.commit()

        # Index the sample repo in background
        await RepositoryIndexer.index_directory(db, repo.id, sample_repo_path)

    await db.commit()
    await db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    proj_query = await db.execute(select(Project).where(Project.id == project_id))
    proj = proj_query.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj
