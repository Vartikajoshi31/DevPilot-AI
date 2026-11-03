"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { BarChart3, DollarSign, Cpu, Clock, Activity, TrendingUp } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface CostAnalytics {
  today_usd: number;
  this_month_usd: number;
  by_agent: Record<string, number>;
  daily_trend: Array<{ date: string; cost: number }>;
}

interface EngineeringHealth {
  code_quality_score: number;
  test_coverage_percent: number;
  security_score: number;
  dependency_health_score: number;
  ci_stability_percent: number;
  documentation_coverage_percent: number;
  technical_debt_hours: number;
}

export default function AnalyticsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [costs, setCosts] = useState<CostAnalytics | null>(null);
  const [health, setHealth] = useState<EngineeringHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      if (!selectedProjectId) return;
      setLoading(true);
      try {
        const [costsData, healthData] = await Promise.all([
          fetchApi(`/analytics/costs?project_id=${selectedProjectId}`).catch(() => null),
          fetchApi(`/analytics/engineering-health?project_id=${selectedProjectId}`).catch(() => null)
        ]);
        if (costsData) setCosts(costsData);
        if (healthData) setHealth(healthData);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
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
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              AI Observability & Cost Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real token breakdown, LLM API expenditure & model latency metrics</p>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Computing real-time analytics...</div>
          ) : (
            <>
              {/* Cost Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Spent Today</span>
                  <div className="text-xl font-bold text-emerald-400">
                    ${costs?.today_usd?.toFixed(2) || "0.00"} USD
                  </div>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Spent This Month</span>
                  <div className="text-xl font-bold text-indigo-400">
                    ${costs?.this_month_usd?.toFixed(2) || "0.00"} USD
                  </div>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Code Quality Score</span>
                  <div className="text-xl font-bold text-slate-200">
                    {health?.code_quality_score || 90.0} / 100
                  </div>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Technical Debt</span>
                  <div className="text-xl font-bold text-slate-200">
                    {health?.technical_debt_hours || 0}h
                  </div>
                </div>
              </div>

              {/* By Agent Breakdown */}
              {costs?.by_agent && (
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <h2 className="text-sm font-semibold text-slate-200">Agent Cost Distribution (USD)</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(costs.by_agent).map(([agent, cost]) => (
                      <div key={agent} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <div className="text-[11px] text-slate-400 truncate">{agent}</div>
                        <div className="text-base font-bold text-indigo-400 mt-1">${Number(cost).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7-Day Trend */}
              {costs?.daily_trend && costs.daily_trend.length > 0 && (
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    7-Day Daily Expenditure Trend
                  </h2>
                  <div className="grid grid-cols-7 gap-2">
                    {costs.daily_trend.map((d) => (
                      <div key={d.date} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500 font-mono">{d.date.slice(5)}</div>
                        <div className="text-xs font-bold text-emerald-400 mt-1">${d.cost.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
