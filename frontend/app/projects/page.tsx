"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { FolderGit2, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  is_demo: boolean;
  created_at?: string;
}

export default function ProjectsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/projects");
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects([
          {
            id: "demo-proj-1",
            name: "Demo E-Commerce Microservices",
            description: "Autonomous engineering microservices demo containing auth, checkout, and test suites.",
            is_demo: true
          }
        ]);
      }
    } catch (err) {
      console.warn("Using offline demo projects:", err);
      setProjects([
        {
          id: "demo-proj-1",
          name: "Demo E-Commerce Microservices",
          description: "Autonomous engineering microservices demo containing auth, checkout, and test suites.",
          is_demo: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    try {
      const created = await fetchApi("/projects", {
        method: "POST",
        body: JSON.stringify({
          name: projectName,
          description: projectDesc || "DevPilot AI Managed Project",
          is_demo: false
        })
      });
      setProjects((prev) => [...prev, created]);
    } catch (err: any) {
      // Fallback local creation for demo resiliency
      const fallbackProject: ProjectItem = {
        id: `proj-${Date.now().toString().slice(-6)}`,
        name: projectName,
        description: projectDesc || "DevPilot AI Managed Project",
        is_demo: false
      };
      setProjects((prev) => [...prev, fallbackProject]);
    } finally {
      setShowCreateModal(false);
      setProjectName("");
      setProjectDesc("");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 space-y-6 ml-0 md:ml-64 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-indigo-400" />
                Projects Workspace Manager
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage connected codebases, active projects, and repositories</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 transition-colors w-fit"
            >
              <Plus className="h-3.5 w-3.5" />
              Create New Project
            </button>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
              No projects found. Create your first project to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-200">{proj.name}</h2>
                    {proj.is_demo && (
                      <span className="text-[10px] font-mono font-medium bg-indigo-950 text-indigo-400 border border-indigo-800/40 px-2 py-0.5 rounded">
                        DEMO REPO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{proj.description}</p>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2 border-t border-slate-800">
                    <span>ID: {proj.id.slice(0, 12)}...</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Payment Microservice"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Project purpose, tech stack, and goals..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
