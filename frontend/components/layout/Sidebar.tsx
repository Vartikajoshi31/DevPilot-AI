"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  GitBranch,
  Bug,
  Bot,
  TestTube2,
  ShieldAlert,
  AlertTriangle,
  Network,
  FileText,
  Plug,
  BarChart3,
  Settings,
  Terminal,
  Sparkles
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderGit2 },
  { label: "Repositories", href: "/repositories", icon: GitBranch },
  { label: "Tasks & Bugs", href: "/bugs", icon: Bug },
  { label: "Agent Runs", href: "/agent-runs", icon: Bot },
  { label: "Tests & QA", href: "/tests", icon: TestTube2 },
  { label: "Security", href: "/security", icon: ShieldAlert },
  { label: "Incidents", href: "/incidents", icon: AlertTriangle },
  { label: "Architecture", href: "/architecture", icon: Network },
  { label: "Documentation", href: "/documentation", icon: FileText },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Analytics & Cost", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 gap-3">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-semibold text-slate-100 text-base tracking-tight leading-none">DevPilot AI</h1>
          <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">Command Center</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Workspace Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-mono text-[11px] text-slate-300">Sandbox: Active</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
        </div>
      </div>
    </aside>
  );
}
