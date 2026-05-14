import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/pm/Sidebar";
import { Topbar } from "@/components/pm/Topbar";
import { Dashboard } from "@/components/pm/Dashboard";
import { ProjectDetail } from "@/components/pm/ProjectDetail";
import { Performance } from "@/components/pm/Performance";
import { Project, projects } from "@/lib/mockData";
import { ProjectCard } from "@/components/pm/ProjectCard";

const Index = () => {
  const [view, setView] = useState<string>("dashboard");
  const [selected, setSelected] = useState<Project | null>(null);

  const handleSelect = (p: Project) => { setSelected(p); setView("detail"); };
  const handleNav = (key: string) => { setSelected(null); setView(key); };

  const titleMap: Record<string, { t: string; s: string }> = {
    dashboard: { t: "Tổng quan sản xuất", s: "Dashboard" },
    projects: { t: "Danh mục dự án", s: "Projects" },
    performance: { t: "Đánh giá hiệu suất", s: "Performance" },
    detail: { t: selected?.name ?? "", s: "Project · " + (selected?.code ?? "") },
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-100 p-3 gap-3">
      <Sidebar active={view === "detail" ? "projects" : view} onNavigate={handleNav} />
      <div className="flex-1 flex flex-col min-w-0 gap-3">
        <Topbar title={titleMap[view].t} subtitle={titleMap[view].s} />
        <main className="flex-1 overflow-x-hidden rounded-[2rem] shadow-sm border border-orange-100/60 bg-amber-50">
            <motion.div
              key={view + (selected?.id ?? "")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {view === "dashboard" && <Dashboard onSelectProject={handleSelect} />}
              {view === "detail" && selected && <ProjectDetail project={selected} onBack={() => handleNav("dashboard")} />}
              {view === "performance" && <Performance />}
               {view === "projects" && (
                 <div className="px-6 lg:px-10 py-8 bg-slate-200">
                   <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onClick={() => handleSelect(p)} />)}
                  </div>
                </div>
              )}
            </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
