import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/pm/Sidebar";
import { Topbar } from "@/components/pm/Topbar";
import { Dashboard } from "@/components/pm/Dashboard";
import { ProjectDetail } from "@/components/pm/ProjectDetail";
import { Performance } from "@/components/pm/Performance";
import { UserManagement } from "@/components/pm/UserManagement";
import { UserGroupManagement } from "@/components/pm/UserGroupManagement";
import { PermissionManagement } from "@/components/pm/PermissionManagement";
import { ProjectAdmin } from "@/components/pm/ProjectAdmin";
import { Project, projects } from "@/lib/mockData";
import { ProjectCard } from "@/components/pm/ProjectCard";
import { Settings } from "lucide-react";

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
    users: { t: "Quản lý Người sử dụng", s: "Quản trị hệ thống" },
    "user-groups": { t: "Quản lý nhóm người dùng", s: "Quản trị hệ thống" },
    permissions: { t: "Quản lý phân quyền", s: "Quản trị hệ thống" },
    "project-admin": { t: "Danh sách dự án", s: "Quản trị dự án" },
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-100 p-3 gap-3">
      <Sidebar active={view === "detail" ? "projects" : view} onNavigate={handleNav} />
      <div className="flex-1 flex flex-col min-w-0 gap-3">
        <Topbar title={titleMap[view].t} subtitle={titleMap[view].s} />
        <main className="flex-1 overflow-x-hidden rounded-[2rem] shadow-sm border border-orange-100/60 bg-slate-200">
            <motion.div
              key={view + (selected?.id ?? "")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {view === "dashboard" && <Dashboard onSelectProject={handleSelect} />}
              {view === "detail" && selected && <ProjectDetail project={selected} onBack={() => handleNav("dashboard")} />}
              {view === "performance" && <Performance />}
              {view === "users" && <UserManagement />}
              {view === "user-groups" && <UserGroupManagement />}
              {view === "permissions" && <PermissionManagement />}
              {view === "project-admin" && <ProjectAdmin />}
               {view === "projects" && (
                 <div className="px-6 lg:px-10 py-8 bg-slate-200">
                   <div className="flex justify-end mb-4">
                     <button
                       onClick={() => handleNav("project-admin")}
                       className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 shadow-sm shadow-orange-500/30 transition-all"
                     >
                       <Settings className="h-3.5 w-3.5" /> Quản trị
                     </button>
                   </div>
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
