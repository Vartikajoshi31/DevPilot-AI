"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Network, Database, Layers, Server, Globe } from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Network className="h-5 w-5 text-indigo-400" />
              Repository Architecture Visualizer
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated component graph, dependency mapping & symbol relationship topology</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center space-y-8 min-h-[450px]">
            {/* Component Relationship Nodes */}
            <div className="flex items-center gap-12">
              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl flex flex-col items-center text-center space-y-2 w-44 shadow-lg shadow-indigo-500/10">
                <Globe className="h-6 w-6 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">Next.js Frontend</span>
                <span className="text-[10px] text-slate-500 font-mono">Port 3000</span>
              </div>

              <div className="h-0.5 w-16 bg-indigo-500/40 relative">
                <span className="absolute -top-2 left-4 text-[9px] font-mono text-indigo-400 bg-slate-900 px-1">REST / WS</span>
              </div>

              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl flex flex-col items-center text-center space-y-2 w-44 shadow-lg shadow-indigo-500/10">
                <Server className="h-6 w-6 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">FastAPI Orchestrator</span>
                <span className="text-[10px] text-slate-500 font-mono">Port 8000</span>
              </div>

              <div className="h-0.5 w-16 bg-indigo-500/40 relative">
                <span className="absolute -top-2 left-4 text-[9px] font-mono text-indigo-400 bg-slate-900 px-1">SQLAlchemy</span>
              </div>

              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl flex flex-col items-center text-center space-y-2 w-44 shadow-lg shadow-indigo-500/10">
                <Database className="h-6 w-6 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">PostgreSQL + pgvector</span>
                <span className="text-[10px] text-slate-500 font-mono">Port 5432</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
