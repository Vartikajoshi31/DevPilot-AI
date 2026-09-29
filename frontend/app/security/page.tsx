"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ShieldAlert, Key, Lock, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-400" />
              Security Audit Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">OWASP Top 10 vulnerabilities, secret detection & API security scans</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-200">Hardcoded API Secret Key</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                HIGH SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-400">Location: <code className="text-slate-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">src/config.py:4</code></p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-slate-300">
              Remediation: Refactor <code className="text-amber-400">API_SECRET_KEY</code> to read from <code className="text-emerald-400">os.getenv("API_SECRET_KEY")</code>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
