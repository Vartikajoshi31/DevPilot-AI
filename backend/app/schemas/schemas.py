from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_demo: bool = False

class ProjectOut(BaseModel):
    id: str
    organization_id: str
    name: str
    description: Optional[str] = None
    is_demo: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Repository Schemas
class RepositoryCreate(BaseModel):
    project_id: str
    name: str
    full_name: str
    clone_url: Optional[str] = None
    default_branch: str = "main"

class RepositoryOut(BaseModel):
    id: str
    project_id: str
    name: str
    full_name: str
    default_branch: str
    status: str
    language: str
    file_count: int
    chunk_count: int
    indexed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Agent Run Schemas
class AgentRunCreate(BaseModel):
    project_id: str
    prompt: str
    workflow_type: str = "autonomous"

class AgentStepOut(BaseModel):
    id: str
    step_number: int
    agent_name: str
    action_type: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    status: str
    tool_name: Optional[str] = None
    duration_ms: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AgentMessageOut(BaseModel):
    id: str
    sender: str
    content: str
    message_type: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ApprovalOut(BaseModel):
    id: str
    agent_run_id: str
    action_type: str
    title: str
    reason: str
    risk_level: str
    files_changed_count: int
    diff_content: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AgentRunOut(BaseModel):
    id: str
    project_id: str
    prompt: str
    workflow_type: str
    status: str
    current_agent: str
    total_steps: int
    total_tokens: int
    estimated_cost_usd: float
    execution_time_ms: int
    summary_result: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    steps: List[AgentStepOut] = []
    messages: List[AgentMessageOut] = []
    approvals: List[ApprovalOut] = []

    class Config:
        from_attributes = True

# Bug Schemas
class BugCreate(BaseModel):
    project_id: str
    title: str
    description: str
    severity: str = "HIGH"
    environment: str = "Production"

class BugOut(BaseModel):
    id: str
    bug_number: str
    title: str
    description: str
    severity: str
    status: str
    environment: str
    reproduction_steps: Optional[Any] = None
    affected_files: Optional[Any] = None
    root_cause: Optional[str] = None
    suggested_fix: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Security Schemas
class SecurityFindingOut(BaseModel):
    id: str
    title: str
    category: str
    severity: str
    file_path: str
    line_number: Optional[int] = None
    description: str
    evidence: Optional[str] = None
    remediation: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Incident Schemas
class IncidentOut(BaseModel):
    id: str
    incident_number: str
    title: str
    severity: str
    status: str
    service: str
    summary: Optional[str] = None
    root_cause: Optional[str] = None
    timeline_json: Optional[Any] = None
    detected_at: datetime

    class Config:
        from_attributes = True

# Approval Resolution Schema
class ApprovalAction(BaseModel):
    approved: bool
    comments: Optional[str] = None
