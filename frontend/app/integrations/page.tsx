"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Plug, GitBranch, Terminal, MessageSquare } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "GitHub Integration", desc: "OAuth 2.0, repository inspection, branch creation & Pull Request generation", status: "Connected", icon: GitBranch },
    { name: "MCP (Model Context Protocol)", desc: "Standard context provider protocol for tools and databases", status: "Active", icon: Terminal },
    { name: "Slack & Jira", desc: "Notification Webhooks & Jira ticket synchronization", status: "Available", icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Plug className="h-5 w-5 text-indigo-400" />
              Integrations & MCP Protocol Hub
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage external connections, MCP tool providers & notification channels</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {integrations.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-indigo-400" />
                      <h2 className="text-sm font-semibold text-slate-200">{item.name}</h2>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
