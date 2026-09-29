"use client";

import { useState } from "react";
import { Bot, CheckCircle2, Clock, Cpu, DollarSign } from "lucide-react";

interface Step {
  step_number: number;
  agent_name: string;
  action_type: string;
  status: string;
  duration_ms: number;
  output?: any;
}

interface AgentStreamViewProps {
  runId?: string;
  initialPrompt?: string;
}

export function AgentStreamView({ runId, initialPrompt = "Users are getting logged out after refreshing the dashboard." }: AgentStreamViewProps) {
  const [steps] = useState<Step[]>([
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Workflow Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Autonomous Agent Orchestrator
              <span className="text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">"{initialPrompt}"</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Tokens: 1,800</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cost: $0.032</span>
          </div>
        </div>
      </div>

      {/* Execution Steps Timeline */}
      <div className="space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Agent Execution Sequence
        </div>

        {steps.map((step) => (
          <div
            key={step.step_number}
            className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3.5 transition-all hover:border-slate-700"
          >
            <div className="mt-0.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="flex-1 space-y-1">
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
