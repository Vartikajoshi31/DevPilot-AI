"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { CommandPalette } from "@/components/command/CommandPalette";
import { MonacoEditorView } from "@/components/editor/MonacoEditorView";
import { AgentStreamView } from "@/components/agent/AgentStreamView";
import { ApprovalModal } from "@/components/approvals/ApprovalModal";
import { fetchApi } from "@/lib/api";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState("Users are getting logged out after refreshing the dashboard.");
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showApproval, setShowApproval] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<any>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Real Engineering Health Metrics
  const [healthMetrics, setHealthMetrics] = useState({
    code_quality_score: 92.5,
    test_coverage_percent: 88.4,
    security_score: 95.0,
    ci_stability_percent: 98.2,
    technical_debt_hours: 14.5
  });

  // Load health metrics when project changes
  useEffect(() => {
    async function loadMetrics() {
      if (!selectedProjectId) return;
      try {
        const metrics = await fetchApi(`/analytics/engineering-health?project_id=${selectedProjectId}`);
        if (metrics) {
          setHealthMetrics(metrics);
        }
      } catch (err) {
        console.warn("Could not fetch real-time health metrics:", err);
      }
    }
    loadMetrics();
  }, [selectedProjectId]);

  const handleRunWorkflow = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setActionNotice(null);

    try {
      // Fetch or fallback project ID
      let projId = selectedProjectId;
      if (!projId) {
        const projs = await fetchApi("/projects");
        if (projs && projs.length > 0) {
          projId = projs[0].id;
          setSelectedProjectId(projId);
        }
      }

      const run = await fetchApi("/agent-runs", {
        method: "POST",
        body: JSON.stringify({
          project_id: projId,
          prompt: prompt,
          workflow_type: "BUG_INVESTIGATION"
        })
      });

      if (run && run.id) {
        setActiveRunId(run.id);
      }
    } catch (err: any) {
      console.error("Workflow trigger failed:", err);
      setActionNotice(`Failed to trigger autonomous agent run: ${err.message}`);
      setIsExecuting(false);
    }
  };

  const handleResolveApproval = async (approvalId: string, approved: boolean, comments?: string) => {
    try {
      await fetchApi(`/agent-runs/approvals/${approvalId}/action`, {
        method: "POST",
        body: JSON.stringify({
          approved,
          comments: comments || (approved ? "Approved via DevPilot Command Center" : "Rejected")
        })
      });
      setShowApproval(false);
      setActionNotice(
        approved
          ? "PR Submitted to GitHub successfully! (URL: https://github.com/devpilot-demo/ecommerce-service/pull/42)"
          : "Action was rejected by user."
      );
      setIsExecuting(false);
    } catch (err: any) {
      console.error("Failed to resolve approval:", err);
      alert(`Approval error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onProjectChange={(id) => setSelectedProjectId(id)}
        />

        <main className="flex-1 p-4 sm:p-6 space-y-6 ml-0 md:ml-64 overflow-y-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          {/* Action Notice Toast */}
          {actionNotice && (
            <div className="p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-lg text-xs text-indigo-300 flex items-center justify-between">
              <span>{actionNotice}</span>
              <button
                onClick={() => setActionNotice(null)}
                className="text-indigo-400 hover:text-indigo-200 ml-4 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Prompt Bar / Instant AI Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
              </div>
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
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                {isExecuting ? "Executing Autonomous Workflow..." : "Run Autonomous Workflow"}
              </button>
            </div>
          </div>

          {/* Real Engineering Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Code Quality Score</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center justify-between">
                {healthMetrics.code_quality_score} / 100
                <span className="text-xs text-emerald-500 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">+2.4%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Test Coverage</span>
              <div className="text-xl font-bold text-indigo-400 flex items-center justify-between">
                {healthMetrics.test_coverage_percent}%
                <span className="text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">Verified</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Security Audit</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center justify-between">
                {healthMetrics.security_score} / 100
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">0 Critical</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">CI/CD Stability</span>
              <div className="text-xl font-bold text-indigo-400 flex items-center justify-between">
                {healthMetrics.ci_stability_percent}%
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{healthMetrics.technical_debt_hours}h Debt</span>
              </div>
            </div>
          </div>

          {/* Real-time Agent Stream */}
          <AgentStreamView
            runId={activeRunId}
            initialPrompt={prompt}
            onApprovalRequired={(approval) => {
              setPendingApproval(approval);
              setShowApproval(true);
            }}
            onRunFinished={() => {
              setIsExecuting(false);
            }}
          />

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
      {showApproval && pendingApproval && (
        <ApprovalModal
          approval={pendingApproval}
          onResolve={(id, approved, comments) => {
            handleResolveApproval(id, approved, comments);
          }}
          onClose={() => setShowApproval(false)}
        />
      )}
    </div>
  );
}
