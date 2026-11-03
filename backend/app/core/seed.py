import os
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.entities import (
    User, Organization, Membership, Project, Repository,
    Bug, TestCase, SecurityFinding, Incident
)
from app.rag.indexer import RepositoryIndexer

logger = logging.getLogger("devpilot.seed")

async def seed_demo_data():
    """Seed initial demo organization, admin user, and sample project if database is fresh."""
    async with AsyncSessionLocal() as db:
        try:
            # Check if admin already exists
            user_query = await db.execute(select(User).where(User.email == "admin@devpilot.ai"))
            admin_user = user_query.scalar_one_or_none()
            
            if not admin_user:
                logger.info("Seeding initial DevPilot AI demo dataset...")
                
                # 1. Admin User
                admin_user = User(
                    email="admin@devpilot.ai",
                    hashed_password=get_password_hash("devpilot123"),
                    full_name="Lead Engineer",
                    role="admin"
                )
                db.add(admin_user)
                await db.flush()

                # 2. Organization
                org = Organization(
                    name="DevPilot AI Engineering",
                    slug="devpilot-eng"
                )
                db.add(org)
                await db.flush()

                # 3. Membership
                membership = Membership(
                    user_id=admin_user.id,
                    organization_id=org.id,
                    role="owner"
                )
                db.add(membership)
                await db.flush()

                # 4. Demo Project
                project = Project(
                    organization_id=org.id,
                    name="Demo E-Commerce Microservices",
                    description="Autonomous engineering microservices demo containing auth, checkout, and test suites.",
                    is_demo=True
                )
                db.add(project)
                await db.flush()

                # 5. Demo Repository
                sample_repo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "demo", "sample_repo"))
                repo = Repository(
                    project_id=project.id,
                    name="ecommerce-service",
                    full_name="devpilot-demo/ecommerce-service",
                    clone_url="https://github.com/devpilot-demo/ecommerce-service.git",
                    default_branch="main",
                    status="READY",
                    language="Python"
                )
                db.add(repo)
                await db.flush()

                # 6. Seed Demo Bugs
                bug1 = Bug(
                    project_id=project.id,
                    bug_number="BUG-101",
                    title="Users are getting logged out after refreshing the dashboard",
                    description="Premature session expiration observed upon page refresh in production dashboard.",
                    severity="HIGH",
                    environment="Production",
                    status="OPEN"
                )
                bug2 = Bug(
                    project_id=project.id,
                    bug_number="BUG-102",
                    title="Checkout fails when coupon is applied",
                    description="Missing minimum boundary check when coupon discount reduces total below zero.",
                    severity="MEDIUM",
                    environment="Staging",
                    status="OPEN"
                )
                db.add_all([bug1, bug2])

                # 7. Seed Demo Test Cases
                tc1 = TestCase(
                    project_id=project.id,
                    test_number="TC-201",
                    title="Session Persistence After Dashboard Refresh",
                    category="Regression",
                    priority="P0",
                    preconditions="Valid user credentials",
                    steps=["Log in as admin", "Obtain session token", "Verify token validity"],
                    expected_result="User session remains valid (TTL > 0)",
                    status="PASSED"
                )
                tc2 = TestCase(
                    project_id=project.id,
                    test_number="TC-202",
                    title="Coupon Discount Calculation Boundary",
                    category="Functional",
                    priority="P1",
                    preconditions="Product with price 100.0",
                    steps=["Apply SAVE20 coupon", "Verify final total amount is 80.0"],
                    expected_result="Total amount reflects accurate discount calculation",
                    status="PASSED"
                )
                tc3 = TestCase(
                    project_id=project.id,
                    test_number="TC-203",
                    title="OWASP Hardcoded Secret Key Scan",
                    category="Security",
                    priority="P0",
                    preconditions="Repo configuration analysis",
                    steps=["Scan src/config.py for plain strings"],
                    expected_result="Zero plaintext API secret tokens committed to source code",
                    status="PASSED"
                )
                db.add_all([tc1, tc2, tc3])

                # 8. Seed Security Findings
                sec1 = SecurityFinding(
                    project_id=project.id,
                    title="Hardcoded API Secret Key",
                    category="Secrets",
                    severity="HIGH",
                    file_path="src/config.py",
                    line_number=4,
                    description="Plaintext API_SECRET_KEY declared directly in source file.",
                    evidence='API_SECRET_KEY = "devpilot_secret_key_prod_123"',
                    remediation='Use os.getenv("API_SECRET_KEY") instead of hardcoding secret constants.',
                    status="OPEN"
                )
                db.add(sec1)

                # 9. Seed Incident
                inc1 = Incident(
                    project_id=project.id,
                    incident_number="INC-402",
                    title="Spike in premature user session logout errors",
                    severity="SEV-2",
                    status="INVESTIGATING",
                    service="Auth Microservice",
                    summary="Multiple user reports indicating unexpected logouts upon navigating or refreshing dashboard.",
                    root_cause="Session token TTL set to 0 in src/auth.py.",
                    timeline_json=[
                        {"time": "10:00 UTC", "event": "Alert triggered: 500+ session expiration events"},
                        {"time": "10:15 UTC", "event": "Autonomous AI Agent triaged root cause to src/auth.py"},
                        {"time": "10:30 UTC", "event": "Remediation patch generated and queued for human approval"}
                    ]
                )
                db.add(inc1)

                await db.commit()
                logger.info("Demo dataset seeded successfully.")

                # Index repo into RAG
                if os.path.exists(sample_repo_path):
                    logger.info("Indexing sample repository files into RAG knowledge store...")
                    await RepositoryIndexer.index_directory(db, repo.id, sample_repo_path)
                    logger.info("Sample repository indexing complete.")
            else:
                logger.info("Database already seeded with admin user.")

        except Exception as e:
            logger.error(f"Error seeding demo data: {e}")
            await db.rollback()
