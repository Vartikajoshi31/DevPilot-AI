import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="engineer")
    avatar_url = Column(String, nullable=True)
    github_access_token = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    memberships = relationship("Membership", back_populates="organization", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="organization", cascade="all, delete-orphan")

class Membership(Base):
    __tablename__ = "memberships"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, default="member")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="memberships")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    organization = relationship("Organization", back_populates="projects")
    repositories = relationship("Repository", back_populates="project", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="project", cascade="all, delete-orphan")
    bugs = relationship("Bug", back_populates="project", cascade="all, delete-orphan")
    test_cases = relationship("TestCase", back_populates="project", cascade="all, delete-orphan")
    security_findings = relationship("SecurityFinding", back_populates="project", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="project", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="project", cascade="all, delete-orphan")

class Repository(Base):
    __tablename__ = "repositories"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    clone_url = Column(String, nullable=True)
    default_branch = Column(String, default="main")
    status = Column(String, default="idle")
    language = Column(String, default="TypeScript")
    file_count = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)
    indexed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    project = relationship("Project", back_populates="repositories")
    files = relationship("RepositoryFile", back_populates="repository", cascade="all, delete-orphan")

class RepositoryFile(Base):
    __tablename__ = "repository_files"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    repository_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    path = Column(String, nullable=False, index=True)
    language = Column(String, nullable=True)
    size_bytes = Column(Integer, default=0)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    repository = relationship("Repository", back_populates="files")
    chunks = relationship("RepositoryChunk", back_populates="file", cascade="all, delete-orphan")

class RepositoryChunk(Base):
    __tablename__ = "repository_chunks"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    file_id = Column(String, ForeignKey("repository_files.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    start_line = Column(Integer, nullable=False)
    end_line = Column(Integer, nullable=False)
    symbol_name = Column(String, nullable=True)
    chunk_type = Column(String, default="code")
    embedding_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    file = relationship("RepositoryFile", back_populates="chunks")

class AgentRun(Base):
    __tablename__ = "agent_runs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    prompt = Column(Text, nullable=False)
    workflow_type = Column(String, default="autonomous")
    status = Column(String, default="PLANNING")
    current_agent = Column(String, default="Orchestrator")
    total_steps = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    estimated_cost_usd = Column(Float, default=0.0)
    execution_time_ms = Column(Integer, default=0)
    summary_result = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    project = relationship("Project", back_populates="agent_runs")
    user = relationship("User", back_populates="agent_runs")
    steps = relationship("AgentStep", back_populates="agent_run", cascade="all, delete-orphan")
    messages = relationship("AgentMessage", back_populates="agent_run", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="agent_run", cascade="all, delete-orphan")

class AgentStep(Base):
    __tablename__ = "agent_steps"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    agent_run_id = Column(String, ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    agent_name = Column(String, nullable=False)
    action_type = Column(String, nullable=False)
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    status = Column(String, default="SUCCESS")
    tool_name = Column(String, nullable=True)
    tokens_used = Column(Integer, default=0)
    duration_ms = Column(Integer, default=0)
    timestamp = Column(DateTime(timezone=True), default=utc_now)
    
    agent_run = relationship("AgentRun", back_populates="steps")

class AgentMessage(Base):
    __tablename__ = "agent_messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    agent_run_id = Column(String, ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    message_type = Column(String, default="info")
    timestamp = Column(DateTime(timezone=True), default=utc_now)
    
    agent_run = relationship("AgentRun", back_populates="messages")

class Bug(Base):
    __tablename__ = "bugs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    bug_number = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="HIGH")
    status = Column(String, default="OPEN")
    environment = Column(String, default="Production")
    reproduction_steps = Column(JSON, nullable=True)
    affected_files = Column(JSON, nullable=True)
    root_cause = Column(Text, nullable=True)
    suggested_fix = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    project = relationship("Project", back_populates="bugs")

class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    test_number = Column(String, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, default="Regression")
    priority = Column(String, default="P1")
    preconditions = Column(Text, nullable=True)
    steps = Column(JSON, nullable=True)
    expected_result = Column(Text, nullable=False)
    status = Column(String, default="PASSED")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    project = relationship("Project", back_populates="test_cases")

class SecurityFinding(Base):
    __tablename__ = "security_findings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, default="MEDIUM")
    file_path = Column(String, nullable=False)
    line_number = Column(Integer, nullable=True)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    remediation = Column(Text, nullable=True)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    project = relationship("Project", back_populates="security_findings")

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    incident_number = Column(String, nullable=False)
    title = Column(String, nullable=False)
    severity = Column(String, default="SEV-2")
    status = Column(String, default="INVESTIGATING")
    service = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    timeline_json = Column(JSON, nullable=True)
    detected_at = Column(DateTime(timezone=True), default=utc_now)
    
    project = relationship("Project", back_populates="incidents")

class Approval(Base):
    __tablename__ = "approvals"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    agent_run_id = Column(String, ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    risk_level = Column(String, default="MEDIUM")
    files_changed_count = Column(Integer, default=0)
    diff_content = Column(Text, nullable=True)
    status = Column(String, default="PENDING")
    reviewed_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    agent_run = relationship("AgentRun", back_populates="approvals")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    details_json = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utc_now)
    
    project = relationship("Project", back_populates="audit_logs")
    user = relationship("User", back_populates="audit_logs")
