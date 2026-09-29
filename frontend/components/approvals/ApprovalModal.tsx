"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, FileCode, AlertTriangle } from "lucide-react";

interface ApprovalModalProps {
  approval: {
    id: string;
    action_type: string;
    title: string;
    reason: string;
    risk_level: string;
    files_changed_count: number;
    diff_content?: string;
  };
  onResolve: (approvalId: string, approved: boolean, comments?: string) => void;
  onClose: () => void;
}

export function ApprovalModal({ approval, onResolve, onClose }: ApprovalModalProps) {
  const [comments, setComments] = useState("");
  const [showDiff, setShowDiff] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">HUMAN APPROVAL REQUIRED</h2>
              <p className="text-xs text-slate-400">Action pending signoff before GitHub PR execution</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {approval.risk_level} RISK
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-medium text-slate-200">{approval.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{approval.reason}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Agent</span>
              <span className="font-mono text-slate-300">Coding Agent</span>
            </div>
            <div>
              <span className="text-slate-500 block">Action</span>
              <span className="font-mono text-slate-300">{approval.action_type}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Files Changed</span>
              <span className="font-mono text-slate-300">{approval.files_changed_count} file</span>
            </div>
          </div>

          {/* Code Diff Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                Proposed Code Diff Preview
              </span>
              <button
                onClick={() => setShowDiff(!showDiff)}
                className="text-[11px] text-indigo-400 hover:underline"
              >
                {showDiff ? "Hide Diff" : "Show Diff"}
              </button>
            </div>

            {showDiff && approval.diff_content && (
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-40">
                {approval.diff_content.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("+")
                        ? "text-emerald-400 bg-emerald-950/30"
                        : line.startsWith("-")
                        ? "text-rose-400 bg-rose-950/30"
                        : "text-slate-400"
                    }
                  >
                    {line}
                  </div>
                ))}
              </pre>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => onResolve(approval.id, false, comments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <XCircle className="h-4 w-4 text-rose-400" />
            Reject Action
          </button>
          <button
            onClick={() => onResolve(approval.id, true, comments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-500/20 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve & Submit PR
          </button>
        </div>
      </div>
    </div>
  );
}
