"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileCode, GitCommit, Check, Sparkles } from "lucide-react";

interface MonacoEditorViewProps {
  initialCode?: string;
  filePath?: string;
}

const DEMO_FILES = [
  { path: "src/auth.py", lang: "python" },
  { path: "src/checkout.py", lang: "python" },
  { path: "src/config.py", lang: "python" },
  { path: "tests/test_auth.py", lang: "python" },
  { path: "README.md", lang: "markdown" }
];

const INITIAL_CODE = `import time

class SessionStore:
    def __init__(self):
        self.sessions = {}

    def create_session(self, user_id: str) -> str:
        token = f"token_{user_id}_{int(time.time())}"
        # FIX: Set session expiry to 24 hours (86400 seconds)
        self.sessions[token] = {"user_id": user_id, "expires_at": time.time() + 86400}
        return token

    def is_valid_session(self, token: str) -> bool:
        session = self.sessions.get(token)
        if not session:
            return False
        return session["expires_at"] > time.time()
`;

export function MonacoEditorView({ initialCode = INITIAL_CODE, filePath = "src/auth.py" }: MonacoEditorViewProps) {
  const [selectedFile, setSelectedFile] = useState(filePath);
  const [code, setCode] = useState(initialCode);

  return (
    <div className="grid grid-cols-12 gap-0 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden h-[600px]">
      {/* File Tree Panel */}
      <div className="col-span-2 bg-slate-950 border-r border-slate-800 p-3 space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 px-2">
          Repository Files
        </div>
        {DEMO_FILES.map((f) => (
          <button
            key={f.path}
            onClick={() => setSelectedFile(f.path)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-mono text-left transition-colors ${
              selectedFile === f.path
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span className="truncate">{f.path}</span>
          </button>
        ))}
      </div>

      {/* Editor Center Panel */}
      <div className="col-span-7 flex flex-col bg-slate-900">
        {/* Editor Bar */}
        <div className="h-10 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
            <FileCode className="h-3.5 w-3.5 text-indigo-400" />
            {selectedFile}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            Patched in Sandbox
          </span>
        </div>

        {/* Monaco Editor Component */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* AI Review Sidebar */}
      <div className="col-span-3 bg-slate-950 border-l border-slate-800 p-4 flex flex-col space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">AI Code Review</h3>
        </div>

        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Check className="h-4 w-4" />
            Root Cause Resolved
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Updated <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">expires_at</code> from <code className="text-rose-400">0</code> to <code className="text-emerald-400">time.time() + 86400</code>.
            Session tokens now remain valid across browser refreshes for 24 hours.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Security Check</span>
          <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>OWASP Vulnerabilities</span>
            <span className="text-emerald-400 font-bold">0 Detected</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>pytest Verification</span>
            <span className="text-emerald-400 font-bold">100% Passed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
