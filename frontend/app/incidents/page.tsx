"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { AlertTriangle, Clock, Activity, FileCode } from "lucide-react";

export default function IncidentsPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-indigo-400" />
              Incident Investigation Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Telemetry log inspection, commit correlation & evidence-backed incident summaries</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                  INC-402
                </span>
                <h2 className="text-sm font-semibold text-slate-200">Spike in premature user session logout errors</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                SEV-2 INVESTIGATING
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400"><strong className="text-slate-200">Service:</strong> Auth Microservice</div>
              <div className="text-slate-400"><strong className="text-slate-200">Summary:</strong> Multiple user reports indicating unexpected logouts upon navigating or refreshing dashboard.</div>
              <div className="text-emerald-400 font-mono"><strong className="text-slate-200">AI Hypothesis:</strong> Session token TTL set to 0 in <code className="bg-slate-900 px-1 py-0.5 rounded">src/auth.py</code>. Fixed in PR #42.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
