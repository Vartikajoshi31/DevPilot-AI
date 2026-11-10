"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { TestTube2, CheckCircle2, XCircle, Play, Sparkles } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface TestCaseItem {
  id: string;
  test_number: string;
  title: string;
  category: string;
  priority: string;
  expected_result: string;
  status: string;
  created_at?: string;
}

export default function TestsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [tests, setTests] = useState<TestCaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultTests: TestCaseItem[] = [
    {
      id: "tc-201",
      test_number: "TC-201",
      title: "Session Persistence After Dashboard Refresh",
      category: "Regression",
      priority: "P0",
      expected_result: "User session remains valid (TTL > 0)",
      status: "PASSED"
    },
    {
      id: "tc-202",
      test_number: "TC-202",
      title: "Coupon Discount Calculation Boundary",
      category: "Functional",
      priority: "P1",
      expected_result: "Total amount reflects accurate discount calculation",
      status: "PASSED"
    },
    {
      id: "tc-203",
      test_number: "TC-203",
      title: "OWASP Hardcoded Secret Key Scan",
      category: "Security",
      priority: "P0",
      expected_result: "Zero plaintext API secret tokens committed to source code",
      status: "PASSED"
    }
  ];

  useEffect(() => {
    async function loadTests() {
      setLoading(true);
      try {
        const data = await fetchApi(`/tests?project_id=${selectedProjectId || "demo-proj-1"}`);
        if (data && data.length > 0) {
          setTests(data);
        } else {
          setTests(defaultTests);
        }
      } catch (err) {
        console.warn("Using default test cases:", err);
        setTests(defaultTests);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, [selectedProjectId]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onProjectChange={(id) => setSelectedProjectId(id)}
        />
        <main className="flex-1 p-4 sm:p-6 space-y-6 ml-0 md:ml-64 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <TestTube2 className="h-5 w-5 text-indigo-400" />
                QA & Automated Test Workspace
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Isolated sandbox test execution & regression coverage</p>
            </div>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Loading automated test suite...</div>
          ) : tests.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
              No test cases recorded for this project.
            </div>
          ) : (
            <div className="space-y-3">
              {tests.map((tc) => (
                <div
                  key={tc.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {tc.status === "PASSED" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {tc.test_number || tc.id.slice(0, 8)}
                        </span>
                        <h2 className="text-sm font-semibold text-slate-200">{tc.title}</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{tc.expected_result}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {tc.category}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {tc.priority}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                        tc.status === "PASSED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {tc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
