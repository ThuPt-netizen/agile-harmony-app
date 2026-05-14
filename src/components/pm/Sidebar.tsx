import { LayoutDashboard, FolderKanban, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import navisoftLogo from "@/assets/navisoft-logo.png";

interface Props {
  active: string;
  onNavigate: (key: string) => void;
}

const items = [
  { key: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { key: "projects", label: "Dự án", icon: FolderKanban },
  { key: "performance", label: "Hiệu suất", icon: BarChart3 },
];

export function Sidebar({ active, onNavigate }: Props) {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white shadow-sm border border-orange-100 rounded-[2rem] sticky top-3 h-[calc(100vh-1.5rem)] relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#FE9D58]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-gray-100 blur-3xl pointer-events-none" />

      <div className="relative px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src={navisoftLogo} alt="NAVISOFT logo" className="h-10 w-10 object-contain" />
          <div>
            <div className="font-display font-bold text-base tracking-tight text-[#1F2937]">NAVISOFT</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-950">Quản lý dự án</div>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 px-3 py-5 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">Workspace</div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all duration-300",
                isActive
                  ? "bg-[#FE9D58] text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#1F2937]"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </nav>

      <div className="relative p-4 border-t border-gray-100">
        <div className="rounded-2xl bg-gray-50 backdrop-blur-sm p-3.5 ring-1 ring-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FE9D58] to-[#ea580c] flex items-center justify-center text-xs font-semibold text-white">
              PT
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate text-[#1F2937] text-gray-950">ThuPT</div>
              <div className="text-[10px] text-gray-950">QA</div>
            </div>
          </div>
        </div>
        <button className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-[#1F2937] hover:bg-gray-50 transition-colors rounded-xl">
          <Settings className="h-3.5 w-3.5" /> Cài đặt
        </button>
      </div>
    </aside>
  );
}
