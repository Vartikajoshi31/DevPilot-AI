"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { BarChart3, DollarSign, Cpu, Clock, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              AI Observability & Cost Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Token breakdown, LLM API expenditure & model latency metrics</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Spent Today</span>
              <div className="text-xl font-bold text-emerald-400">$4.21 USD</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Spent This Month</span>
              <div className="text-xl font-bold text-indigo-400">$118.42 USD</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Total Tokens</span>
              <div className="text-xl font-bold text-slate-200">28,430</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Average Latency</span>
              <div className="text-xl font-bold text-slate-200">1.24s</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
