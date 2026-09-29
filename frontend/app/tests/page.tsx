"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { TestTube2, CheckCircle2, XCircle, Play, Sparkles } from "lucide-react";

export default function TestsPage() {
  const tests = [
    {
      id: "TC-201",
      title: "Session Persistence After Dashboard Refresh",
      category: "Regression",
      priority: "P0",
      expected: "User remains authenticated after page refresh",
      status: "PASSED"
    },
    {
      id: "TC-202",
      title: "Coupon Discount Calculation Boundary",
      category: "Functional",
      priority: "P1",
      expected: "Total amount minimum bound enforced accurately",
      status: "PASSED"
    },
    {
      id: "TC-203",
      title: "OWASP Hardcoded Secret Key Scan",
      category: "Security",
      priority: "P0",
      expected: "Zero secrets hardcoded in configuration files",
      status: "PASSED"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 space-y-6 ml-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <TestTube2 className="h-5 w-5 text-indigo-400" />
                QA & Automated Test Workspace
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Isolated sandbox test execution & coverage analysis</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors">
              <Play className="h-3.5 w-3.5" />
              Execute Sandbox Pytest Suite
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Test ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Expected Result</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {tests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="p-4 text-indigo-400 font-bold">{t.id}</td>
                    <td className="p-4 font-sans text-slate-200">{t.title}</td>
                    <td className="p-4">{t.category}</td>
                    <td className="p-4"><span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">{t.priority}</span></td>
                    <td className="p-4 font-sans text-slate-400">{t.expected}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-sans font-medium text-[11px]">
                        <CheckCircle2 className="h-4 w-4" />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
