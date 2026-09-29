"use client";

import { useState } from "react";
import { Search, Command, Bell, Cpu, ShieldCheck, User } from "lucide-react";

interface TopNavProps {
  onOpenCommandPalette?: () => void;
}

export function TopNav({ onOpenCommandPalette }: TopNavProps) {
  const [selectedProject, setSelectedProject] = useState("Demo E-Commerce Microservices");

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 ml-64">
      {/* Project Selector & Search */}
      <div className="flex items-center gap-4">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium rounded-md px-3 py-1.5 focus:outline-none focus:border-indigo-500"
        >
          <option>Demo E-Commerce Microservices</option>
          <option>Auth & Identity Service</option>
          <option>Payment Gateway v2</option>
        </select>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs px-3 py-1.5 rounded-md w-72 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search repo or run command...</span>
          <kbd className="ml-auto flex items-center gap-0.5 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            <Command className="h-3 w-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Agent Status Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
          <Cpu className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-slate-300 font-medium">Orchestrator:</span>
          <span className="text-emerald-400 font-medium">Ready</span>
        </div>

        {/* Notifications */}
        <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-900 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-medium text-slate-200">Lead Engineer</div>
            <div className="text-[10px] text-slate-400">admin@devpilot.ai</div>
          </div>
        </div>
      </div>
    </header>
  );
}
