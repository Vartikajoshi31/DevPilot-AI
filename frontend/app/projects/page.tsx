"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { FolderGit2, Plus, Sparkles, CheckCircle2 } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-indigo-400" />
                Projects Workspace Manager
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage connected codebases, active projects, and demo environments</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Create New Project
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-200">Demo E-Commerce Microservices</h2>
                <span className="text-[10px] font-mono font-medium bg-indigo-950 text-indigo-400 border border-indigo-800/40 px-2 py-0.5 rounded">DEMO REPO</span>
              </div>
              <p className="text-xs text-slate-400">Pre-seeded demo repository containing authentication, checkout, and test suites.</p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span>Indexed: 5 files</span>
                <span>Chunks: 12 AST blocks</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
