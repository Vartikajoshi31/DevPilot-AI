"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ShieldAlert, Key, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface SecurityFindingItem {
  id: string;
  title: string;
  category: string;
  severity: string;
  file_path: string;
  line_number?: number;
  description: string;
  evidence?: string;
  remediation?: string;
  status: string;
}

export default function SecurityPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [findings, setFindings] = useState<SecurityFindingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultFindings: SecurityFindingItem[] = [
    {
      id: "sec-1",
      title: "Hardcoded API Secret Key",
      category: "Secrets",
      severity: "HIGH",
      file_path: "src/config.py",
      line_number: 4,
      description: "Plaintext API_SECRET_KEY declared directly in source file.",
      evidence: 'API_SECRET_KEY = "devpilot_secret_key_prod_123"',
      remediation: 'Use os.getenv("API_SECRET_KEY") instead of hardcoding secret constants.',
      status: "OPEN"
    }
  ];

  useEffect(() => {
    async function loadSecurity() {
      setLoading(true);
      try {
        const data = await fetchApi(`/security?project_id=${selectedProjectId || "demo-proj-1"}`);
        if (data && data.length > 0) {
          setFindings(data);
        } else {
          setFindings(defaultFindings);
        }
      } catch (err) {
        console.warn("Using default security findings:", err);
        setFindings(defaultFindings);
      } finally {
        setLoading(false);
      }
    }
    loadSecurity();
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
              <ShieldAlert className="h-5 w-5 text-indigo-400" />
              Security Audit Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">OWASP Top 10 vulnerabilities, secret detection & API security scans</p>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Loading security audit findings...</div>
          ) : findings.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              <span>Clean scan! No open security vulnerabilities found in project.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {findings.map((item) => (
                <div key={item.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-amber-400" />
                      <h2 className="text-sm font-semibold text-slate-200">{item.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                          item.severity === "CRITICAL" || item.severity === "HIGH"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.severity} SEVERITY
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Location:{" "}
                    <code className="text-slate-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">
                      {item.file_path}
                      {item.line_number ? `:${item.line_number}` : ""}
                    </code>
                  </p>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                    <div>{item.description}</div>
                    {item.remediation && (
                      <div className="text-emerald-400 pt-1">
                        Remediation: {item.remediation}
                      </div>
                    )}
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
