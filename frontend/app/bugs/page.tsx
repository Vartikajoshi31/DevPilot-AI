"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Bug as BugIcon, AlertCircle, FileCode, CheckCircle2, Clock, Sparkles, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface BugItem {
  id: string;
  bug_number: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  environment: string;
  created_at?: string;
}

export default function BugsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [bugs, setBugs] = useState<BugItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewBugModal, setShowNewBugModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState("HIGH");

  useEffect(() => {
    async function loadBugs() {
      if (!selectedProjectId) return;
      setLoading(true);
      try {
        const data = await fetchApi(`/bugs?project_id=${selectedProjectId}`);
        setBugs(data || []);
      } catch (err) {
        console.error("Failed to load bugs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBugs();
  }, [selectedProjectId]);

  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedProjectId) return;
    try {
      const created = await fetchApi("/bugs", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          title: newTitle,
          description: newDesc || newTitle,
          severity: newSeverity,
          environment: "Production"
        })
      });
      setBugs((prev) => [created, ...prev]);
      setShowNewBugModal(false);
      setNewTitle("");
      setNewDesc("");
    } catch (err: any) {
      alert(`Error creating bug: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onProjectChange={(id) => setSelectedProjectId(id)}
        />
        <main className="flex-1 p-4 sm:p-6 space-y-6 ml-0 md:ml-64 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <BugIcon className="h-5 w-5 text-indigo-400" />
                Bug Investigation Workspace
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Automated root cause evidence & AI remediation tracking</p>
            </div>
            <button
              onClick={() => setShowNewBugModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors w-fit"
            >
              <Plus className="h-4 w-4" />
              Report New Bug
            </button>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Loading bugs from backend database...</div>
          ) : bugs.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
              No bugs registered for this project yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bugs.map((bug) => (
                <div key={bug.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                        {bug.bug_number || bug.id.slice(0, 8)}
                      </span>
                      <h2 className="text-sm font-semibold text-slate-200">{bug.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                          bug.severity === "CRITICAL" || bug.severity === "HIGH"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {bug.severity}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {bug.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Description</span>
                      <span className="text-slate-300 font-mono">{bug.description}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Environment</span>
                      <span className="text-indigo-400 font-mono">{bug.environment || "Production"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* New Bug Modal */}
      {showNewBugModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Report New Project Bug</h3>
            <form onSubmit={handleCreateBug} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Bug Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Memory leak in worker queue"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details and stack trace..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewBugModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                >
                  Create Bug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
