from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class AgentRunState:
    run_id: str
    project_id: str
    prompt: str
    workflow_type: str = "autonomous"
    status: str = "PLANNING"
    current_agent: str = "Orchestrator"
    step_number: int = 0
    workspace_path: str = ""
    plan: Optional[Dict[str, Any]] = None
    research_results: List[Dict[str, Any]] = field(default_factory=list)
    code_patches: List[Dict[str, Any]] = field(default_factory=list)
    test_results: Optional[Dict[str, Any]] = None
    debug_attempts: int = 0
    max_debug_attempts: int = 3
    security_findings: List[Dict[str, Any]] = field(default_factory=list)
    review_comments: List[str] = field(default_factory=list)
    approval_required: bool = False
    approval_id: Optional[str] = None
    tokens_used: int = 0
    estimated_cost_usd: float = 0.0
    summary: str = ""
