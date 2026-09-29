"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bug, ShieldAlert, GitBranch, Terminal, Sparkles, X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRunPrompt?: (prompt: string) => void;
}

const COMMAND_SUGGESTIONS = [
  { label: "Users are getting logged out after refreshing the dashboard.", category: "Bug Fix", icon: Bug },
  { label: "Find all authentication code", category: "Search", icon: Search },
  { label: "Run security audit on repository", category: "Security", icon: ShieldAlert },
  { label: "Execute pytest test suite in sandbox", category: "Testing", icon: Terminal },
  { label: "Explain project architecture & service graph", category: "Architecture", icon: GitBranch }
];

export function CommandPalette({ isOpen, onClose, onRunPrompt }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (text: string) => {
    onClose();
    if (onRunPrompt) {
      onRunPrompt(text);
    } else {
      router.push(`/dashboard?prompt=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Input Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSelect(query);
              }
            }}
            placeholder="Ask DevPilot AI or execute a command..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Suggestions List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1.5">
            Suggested AI Workflows
          </div>
          {COMMAND_SUGGESTIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(item.label)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-400" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[11px] font-medium bg-slate-800 group-hover:bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 border border-slate-700">Enter</kbd> to launch workflow</span>
          <span><kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 border border-slate-700">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
