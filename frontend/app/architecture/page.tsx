"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Network, Database, Layers, Server, Globe } from "lucide-react";

export default function ArchitecturePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 p-4 sm:p-6 space-y-6 ml-0 md:ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Network className="h-5 w-5 text-indigo-400" />
              Repository Architecture Visualizer
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated component graph, dependency mapping & symbol relationship topology</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-8 min-h-[450px]">
            {/* Component Relationship Nodes */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full justify-center">
              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl flex flex-col items-center text-center space-y-2 w-44 shadow-lg shadow-indigo-500/10">
                <Globe className="h-6 w-6 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">Next.js Frontend</span>
                <span className="text-[10px] text-slate-500 font-mono">Port 3000</span>
              </div>

              <div className="h-8 md:h-0.5 w-0.5 md:w-16 bg-indigo-500/40 relative">
                <span className="hidden md:inline absolute -top-2 left-4 text-[9px] font-mono text-indigo-400 bg-slate-900 px-1">REST / WS</span>
              </div>

              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl flex flex-col items-center text-center space-y-2 w-44 shadow-lg shadow-indigo-500/10">
                <Server className="h-6 w-6 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">FastAPI Orchestrator</span>
                <span className="text-[10px] text-slate-500 font-mono">Port 8000</span>
              </div>

              <div className="h-8 md:h-0.5 w-0.5 md:w-16 bg-indigo-500/40 relative">
                <span className="hidden md:inline absolute -top-2 left-4 text-[9px] font-mono text-indigo-400 bg-slate-900 px-1">SQLAlchemy</span>
              </div>

              <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl flex flex-col items-center text-center space-y-2 w-44 shadow-lg shadow-indigo-500/10">
                <Database className="h-6 w-6 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">PostgreSQL / SQLite</span>
                <span className="text-[10px] text-slate-500 font-mono">devpilot.db</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
