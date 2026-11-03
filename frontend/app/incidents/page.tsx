"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { AlertTriangle, Clock, Activity, FileCode } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface IncidentItem {
  id: string;
  incident_number: string;
  title: string;
  severity: string;
  status: string;
  service: string;
  summary: string;
  root_cause: string;
  timeline_json?: any;
}

export default function IncidentsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      if (!selectedProjectId) return;
      setLoading(true);
      try {
        const data = await fetchApi(`/incidents?project_id=${selectedProjectId}`);
        setIncidents(data || []);
      } catch (err) {
        console.error("Failed to load incidents:", err);
      } finally {
        setLoading(false);
      }
    }
    loadIncidents();
  }, [selectedProjectId]);

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
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-indigo-400" />
              Incident Investigation Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Telemetry log inspection, commit correlation & evidence-backed incident summaries</p>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Loading incidents...</div>
          ) : incidents.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
              No active incidents reported for this project.
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                        {inc.incident_number || inc.id.slice(0, 8)}
                      </span>
                      <h2 className="text-sm font-semibold text-slate-200">{inc.title}</h2>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {inc.severity} {inc.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                    <div className="text-slate-400">
                      <strong className="text-slate-200">Service:</strong> {inc.service}
                    </div>
                    {inc.summary && (
                      <div className="text-slate-400">
                        <strong className="text-slate-200">Summary:</strong> {inc.summary}
                      </div>
                    )}
                    {inc.root_cause && (
                      <div className="text-emerald-400 font-mono">
                        <strong className="text-slate-200">AI Hypothesis:</strong> {inc.root_cause}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
