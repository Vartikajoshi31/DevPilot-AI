"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Bug, AlertCircle, FileCode, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function BugsPage() {
  const [bugs] = useState([
    {
      id: "BUG-101",
      title: "Users are getting logged out after refreshing the dashboard",
      severity: "HIGH",
      status: "INVESTIGATING",
      environment: "Production",
      affected_files: ["src/auth.py", "tests/test_auth.py"],
      root_cause: "Session token TTL expires immediately due to expires_at = 0",
      suggested_fix: "Set expires_at = time.time() + 86400 in SessionStore.create_session()"
    },
    {
      id: "BUG-102",
      title: "Checkout fails when coupon is applied",
      severity: "MEDIUM",
      status: "OPEN",
      environment: "Staging",
      affected_files: ["src/checkout.py"],
      root_cause: "Missing zero boundary check when coupon discount reduces total to negative",
      suggested_fix: "Add validation for total amount minimum bound"
    }
  ]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Bug className="h-5 w-5 text-indigo-400" />
                Bug Investigation Workspace
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Automated root cause evidence & AI remediation tracking</p>
            </div>
          </div>

          <div className="space-y-4">
            {bugs.map((bug) => (
              <div key={bug.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                      {bug.id}
                    </span>
                    <h2 className="text-sm font-semibold text-slate-200">{bug.title}</h2>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {bug.severity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Root Cause Evidence</span>
                    <span className="text-slate-300 font-mono">{bug.root_cause}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">AI Remediation Plan</span>
                    <span className="text-emerald-400 font-mono">{bug.suggested_fix}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
