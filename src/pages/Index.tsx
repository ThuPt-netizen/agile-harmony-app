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
import { ImportData } from "@/components/pm/ImportData";
import { EmployeeProfile } from "@/components/pm/EmployeeProfile";
import { HrUserGroups } from "@/components/pm/HrUserGroups";
import { HrEmployeeList } from "@/components/pm/HrEmployeeList";
import { HrAttendance } from "@/components/pm/HrAttendance";
import { HrCandidates } from "@/components/pm/HrCandidates";
import { HrProjects } from "@/components/pm/HrProjects";
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
    "import-resource-plan": { t: "Import nguồn lực - kế hoạch", s: "Import dữ liệu" },
    "import-actual-plan": { t: "Import thực tế - kế hoạch", s: "Import dữ liệu" },
    "import-finance": { t: "Import nguồn lực tài chính", s: "Import dữ liệu" },
    "hr-profile": { t: "Thông tin cá nhân", s: "Quản lý nhân sự" },
    "hr-user-groups": { t: "Quản lý nhóm NSD", s: "Quản lý nhân sự" },
    "hr-employees": { t: "Danh sách nhân sự", s: "Quản lý nhân sự" },
    "hr-attendance": { t: "Danh sách chấm công", s: "Quản lý nhân sự" },
    "hr-candidates": { t: "Danh sách ứng viên", s: "Quản lý nhân sự" },
    "hr-projects": { t: "Danh sách dự án", s: "Quản lý nhân sự" },
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-100 p-3 gap-3">
      <Sidebar active={(view === "detail" || view === "project-admin") ? "projects" : view} onNavigate={handleNav} />
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
              {view === "detail" && selected && <ProjectDetail project={selected} onBack={() => handleNav("dashboard")} onAdmin={() => setView("project-admin")} />}
              {view === "performance" && <Performance />}
              {view === "users" && <UserManagement />}
              {view === "user-groups" && <UserGroupManagement />}
              {view === "permissions" && <PermissionManagement />}
              {view === "project-admin" && <ProjectAdmin />}
              {view === "import-resource-plan" && <ImportData variant="resource-plan" />}
              {view === "import-actual-plan" && <ImportData variant="actual-plan" />}
              {view === "import-finance" && <ImportData variant="finance" />}
              {view === "hr-profile" && <EmployeeProfile />}
              {view === "hr-user-groups" && <HrUserGroups />}
              {view === "hr-employees" && <HrEmployeeList />}
              {view === "hr-attendance" && <HrAttendance />}
              {view === "hr-candidates" && <HrCandidates />}
              {view === "hr-projects" && <HrProjects />}
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
