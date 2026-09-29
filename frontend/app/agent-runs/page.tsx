"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { AgentStreamView } from "@/components/agent/AgentStreamView";
import { Bot } from "lucide-react";

export default function AgentRunsPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              Agent Run History & Step Replay
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Replay step-by-step agent trajectories, tool invocations & token telemetry</p>
          </div>

          <AgentStreamView initialPrompt="Users are getting logged out after refreshing the dashboard." />
        </main>
      </div>
    </div>
  );
}
