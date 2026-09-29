"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { CommandPalette } from "@/components/command/CommandPalette";
import { MonacoEditorView } from "@/components/editor/MonacoEditorView";
import { AgentStreamView } from "@/components/agent/AgentStreamView";
import { ApprovalModal } from "@/components/approvals/ApprovalModal";
import {
  ShieldCheck,
  CheckCircle2,
  Bug,
  Bot,
  AlertTriangle,
  FileCode,
  ArrowUpRight,
  Sparkles,
  Send,
  Play,
  Activity,
  Layers,
  BarChart2
} from "lucide-react";

export default function DashboardPage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [prompt, setPrompt] = useState("Users are getting logged out after refreshing the dashboard.");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showApproval, setShowApproval] = useState(false);

  const handleRunWorkflow = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setShowApproval(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">Engineering Command Center</h1>
              <p className="text-xs text-slate-400 mt-0.5">Real-time autonomous AI engineering workspace & health metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Launch AI Agent Task
              </button>
            </div>
          </div>

          {/* Prompt Bar / Instant AI Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt e.g. 'Users are getting logged out after refreshing the dashboard'..."
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleRunWorkflow}
                disabled={isExecuting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                {isExecuting ? "Executing Workflow..." : "Run Autonomous Workflow"}
              </button>
            </div>
          </div>

          {/* Engineering Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Code Quality Score</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center justify-between">
                92.5 / 100
                <span className="text-xs text-emerald-500 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">+2.4%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Test Coverage</span>
              <div className="text-xl font-bold text-indigo-400 flex items-center justify-between">
                88.4%
                <span className="text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">127 Passed</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Security Audit</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center justify-between">
                95.0 / 100
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">0 Critical</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">CI/CD Stability</span>
              <div className="text-xl font-bold text-indigo-400 flex items-center justify-between">
                98.2%
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">14.5h Debt</span>
              </div>
            </div>
          </div>

          {/* Real-time Agent Stream */}
          <AgentStreamView initialPrompt={prompt} />

          {/* Code Editor & Patch Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">Sandbox Code Workspace & Diff Preview</h2>
              <span className="text-xs text-indigo-400 font-mono">src/auth.py (Patched)</span>
            </div>
            <MonacoEditorView filePath="src/auth.py" />
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onRunPrompt={(p) => {
          setPrompt(p);
          handleRunWorkflow();
        }}
      />

      {/* Human Approval Gate Modal */}
      {showApproval && (
        <ApprovalModal
          approval={{
            id: "app-8821",
            action_type: "Create GitHub Pull Request",
            title: "Fix session persistence after dashboard refresh",
            reason: "Resolved premature token expiration in SessionStore.create_session() by updating TTL to 86400s",
            risk_level: "LOW",
            files_changed_count: 1,
            diff_content: `--- a/src/auth.py\n+++ b/src/auth.py\n@@ -9,2 +9,2 @@\n- self.sessions[token] = {"user_id": user_id, "expires_at": 0}\n+ self.sessions[token] = {"user_id": user_id, "expires_at": time.time() + 86400}`
          }}
          onResolve={(id, approved) => {
            setShowApproval(false);
            alert(approved ? "PR Submitted to GitHub successfully! (URL: https://github.com/devpilot-demo/ecommerce-service/pull/42)" : "Action rejected.");
          }}
          onClose={() => setShowApproval(false)}
        />
      )}
    </div>
  );
}
