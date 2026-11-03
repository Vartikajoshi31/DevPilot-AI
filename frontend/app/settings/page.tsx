"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Settings, Key, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
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
              <Settings className="h-5 w-5 text-indigo-400" />
              Application & Model Settings
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Configure AI providers (Google Gemini, OpenAI, Anthropic) & security options</p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 max-w-2xl">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Key className="h-4 w-4 text-indigo-400" />
              AI Provider Credentials
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Anthropic API Key</label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("Settings saved locally.")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
