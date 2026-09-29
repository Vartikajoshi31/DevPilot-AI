"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { FileText, Sparkles } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                Documentation Generator & Onboarding Assistant
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Automated README updates, API reference docs & architecture guides</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors">
              <Sparkles className="h-3.5 w-3.5" />
              Generate Updated Documentation
            </button>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono text-xs text-slate-300">
            <h2 className="text-sm font-sans font-semibold text-slate-100"># Sample E-Commerce Backend Service</h2>
            <p className="text-slate-400 font-sans text-xs">A demo repository for DevPilot AI containing authentication and checkout microservices.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
