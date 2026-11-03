"use client";

import { useEffect, useState } from "react";
import { Search, Command, Bell, Cpu, Menu, User } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface TopNavProps {
  onOpenCommandPalette?: () => void;
  onToggleMobileMenu?: () => void;
  onProjectChange?: (projectId: string) => void;
}

interface ProjectItem {
  id: string;
  name: string;
  is_demo: boolean;
}

export function TopNav({ onOpenCommandPalette, onToggleMobileMenu, onProjectChange }: TopNavProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [userName, setUserName] = useState<string>("Lead Engineer");
  const [userEmail, setUserEmail] = useState<string>("admin@devpilot.ai");

  useEffect(() => {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem("devpilot_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.full_name) setUserName(parsed.full_name);
            if (parsed.email) setUserEmail(parsed.email);
          } catch {
            // Ignore parse error
          }
        }

        const projectList: ProjectItem[] = await fetchApi("/projects");
        if (projectList && projectList.length > 0) {
          setProjects(projectList);
          setSelectedProjectId(projectList[0].id);
          if (onProjectChange) {
            onProjectChange(projectList[0].id);
          }
        }
      } catch (err) {
        // Fallback default
        setProjects([
          { id: "demo-proj-1", name: "Demo E-Commerce Microservices", is_demo: true }
        ]);
      }
    }
    loadData();
  }, []);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    if (onProjectChange) {
      onProjectChange(id);
    }
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 ml-0 md:ml-64 transition-all">
      {/* Mobile Toggle & Project Selector & Search */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-slate-400 hover:text-slate-200 p-1.5 rounded-lg border border-slate-800 bg-slate-900"
            aria-label="Open Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <select
          value={selectedProjectId}
          onChange={(e) => handleSelectProject(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium rounded-md px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 max-w-[180px] sm:max-w-xs truncate"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs px-3 py-1.5 rounded-md w-56 lg:w-72 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="truncate">Search repo or run command...</span>
          <kbd className="ml-auto hidden lg:flex items-center gap-0.5 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            <Command className="h-3 w-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Agent Status Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
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
          <div className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-medium text-slate-200">{userName}</div>
            <div className="text-[10px] text-slate-400">{userEmail}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
