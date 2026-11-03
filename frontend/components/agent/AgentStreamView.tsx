"use client";

import { useEffect, useState, useRef } from "react";
import { Bot, CheckCircle2, Clock, Cpu, DollarSign, AlertCircle, RefreshCw } from "lucide-react";
import { fetchApi, WS_BASE_URL } from "@/lib/api";

export interface Step {
  step_number: number;
  agent_name: string;
  action_type: string;
  status: string;
  duration_ms: number;
  output?: any;
}

interface AgentStreamViewProps {
  runId?: string | null;
  initialPrompt?: string;
  onApprovalRequired?: (approval: any) => void;
  onRunFinished?: (run: any) => void;
}

export function AgentStreamView({
  runId,
  initialPrompt = "Users are getting logged out after refreshing the dashboard.",
  onApprovalRequired,
  onRunFinished
}: AgentStreamViewProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>("Orchestrator");
  const [runStatus, setRunStatus] = useState<string>("IDLE");
  const [tokensUsed, setTokensUsed] = useState<number>(0);
  const [costUsd, setCostUsd] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Load existing run data and establish WebSocket when runId changes
  useEffect(() => {
    if (!runId) {
      // Default initial view before run starts
      setSteps([
        {
          step_number: 1,
          agent_name: "Planner Agent",
          action_type: "Formulate Plan",
          status: "SUCCESS",
          duration_ms: 120,
          output: { objective: initialPrompt, strategy: "AST Code Search -> Patch src/auth.py -> Pytest execution" }
        },
        {
          step_number: 2,
          agent_name: "Repository Research Agent",
          action_type: "AST Hybrid Search",
          status: "SUCCESS",
          duration_ms: 340,
          output: { root_cause: "src/auth.py: expires_at set to 0 in SessionStore" }
        },
        {
          step_number: 3,
          agent_name: "Coding Agent",
          action_type: "Generate Patch",
          status: "SUCCESS",
          duration_ms: 580,
          output: { file: "src/auth.py", diff: "+ self.sessions[token] = {'user_id': user_id, 'expires_at': time.time() + 86400}" }
        },
        {
          step_number: 4,
          agent_name: "Test Agent",
          action_type: "Execute Pytest",
          status: "SUCCESS",
          duration_ms: 820,
          output: { pytest: "3 passed in 0.04s (100% pass rate)" }
        }
      ]);
      setRunStatus("READY");
      setTokensUsed(1800);
      setCostUsd(0.032);
      return;
    }

    setSteps([]);
    setLogs([]);
    setRunStatus("STARTING");

    let isMounted = true;

    // Fetch initial run record
    async function loadRun() {
      try {
        const runData = await fetchApi(`/agent-runs/${runId}`);
        if (!isMounted) return;

        setRunStatus(runData.status);
        setCurrentAgent(runData.current_agent || "Orchestrator");
        setTokensUsed(runData.total_tokens || 0);
        setCostUsd(runData.estimated_cost_usd || 0);

        if (runData.steps && runData.steps.length > 0) {
          setSteps(runData.steps);
        }

        if (runData.approvals && runData.approvals.length > 0) {
          const pendingApproval = runData.approvals.find((a: any) => a.status === "PENDING");
          if (pendingApproval && onApprovalRequired) {
            onApprovalRequired(pendingApproval);
          }
        }

        if (runData.status === "COMPLETED" && onRunFinished) {
          onRunFinished(runData);
        }
      } catch (err) {
        console.error("Failed to load run data:", err);
      }
    }

    loadRun();

    // Connect WebSocket
    const token = typeof window !== "undefined" ? localStorage.getItem("devpilot_token") || "" : "";
    const wsUrl = `${WS_BASE_URL}/agent-runs/${runId}/ws?token=${encodeURIComponent(token)}`;

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setLogs((prev) => [...prev, "WebSocket connected to agent orchestrator."]);
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "step_update") {
            setCurrentAgent(data.agent_name);
            setSteps((prev) => {
              const existingIndex = prev.findIndex((s) => s.step_number === data.step_number);
              const newStep: Step = {
                step_number: data.step_number,
                agent_name: data.agent_name,
                action_type: data.action_type,
                status: data.status,
                duration_ms: data.duration_ms || 150,
                output: data.output
              };
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newStep;
                return updated;
              }
              return [...prev, newStep];
            });
            setTokensUsed((prev) => prev + 450);
            setCostUsd((prev) => Number((prev + 0.008).toFixed(4)));
          } else if (data.type === "message") {
            setLogs((prev) => [...prev, `[${data.sender}] ${data.content}`]);
          } else if (data.type === "approval_resolved") {
            setRunStatus(data.status === "APPROVED" ? "COMPLETED" : "REJECTED");
          }

          // Check if approval is now pending
          const latestRun = await fetchApi(`/agent-runs/${runId}`);
          setRunStatus(latestRun.status);
          setCurrentAgent(latestRun.current_agent || "Orchestrator");
          if (latestRun.approvals && latestRun.approvals.length > 0) {
            const pending = latestRun.approvals.find((a: any) => a.status === "PENDING");
            if (pending && onApprovalRequired) {
              onApprovalRequired(pending);
            }
          }
          if (latestRun.status === "COMPLETED" && onRunFinished) {
            onRunFinished(latestRun);
          }
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      socket.onerror = (err) => {
        console.warn("WebSocket error:", err);
      };

      socket.onclose = () => {
        setLogs((prev) => [...prev, "WebSocket connection closed."]);
      };
    } catch (wsErr) {
      console.error("Failed to initialize WebSocket:", wsErr);
    }

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [runId]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
      {/* Workflow Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Autonomous Agent Orchestrator: {currentAgent}
              <span
                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  runStatus === "COMPLETED"
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                    : runStatus === "FAILED"
                    ? "bg-rose-950/60 text-rose-400 border-rose-800/40"
                    : runStatus === "WAITING_FOR_APPROVAL"
                    ? "bg-amber-950/60 text-amber-400 border-amber-800/40"
                    : "bg-indigo-950/60 text-indigo-400 border-indigo-800/40"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    runStatus === "COMPLETED" ? "bg-emerald-400" : "bg-indigo-400 animate-pulse"
                  }`}
                />
                {runStatus}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl truncate">"{initialPrompt}"</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Tokens: {tokensUsed.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cost: ${costUsd.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Execution Steps Timeline */}
      <div className="space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Agent Execution Sequence ({steps.length} Steps)
        </div>

        {steps.map((step) => (
          <div
            key={step.step_number}
            className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3.5 transition-all hover:border-slate-700"
          >
            <div className="mt-0.5">
              {step.status === "SUCCESS" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400" />
              )}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  Step {step.step_number}: {step.agent_name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {step.duration_ms}ms
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">Action: {step.action_type}</div>

              {step.output && (
                <pre className="mt-2 p-2 bg-slate-900 rounded border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
