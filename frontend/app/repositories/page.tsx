"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { GitBranch, RefreshCw, CheckCircle2 } from "lucide-react";

export default function RepositoriesPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-indigo-400" />
                Repositories & RAG Indexing Manager
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">AST code parsing, metadata extraction & vector embeddings</p>
            </div>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
              Re-Index AST Vector Database
            </button>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">devpilot-demo/ecommerce-service</h2>
                <span className="text-[11px] font-mono text-slate-400">Branch: main</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                <CheckCircle2 className="h-3.5 w-3.5" />
                INDEXED
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
