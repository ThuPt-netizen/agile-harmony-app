import { Search, Bell } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-3 z-20 bg-white/90 backdrop-blur-lg border border-orange-100 rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4 bg-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] mb-1 text-slate-500">
            <span className="font-semibold text-yellow-500">NAVISOFT</span>
            <span className="opacity-40">/</span>
            <span>{subtitle ?? "Workspace"}</span>
          </div>
          <h1 className="font-display text-2xl lg:text-[28px] font-semibold tracking-tight text-[#1F2937]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#FE9D58] backdrop-blur-sm w-72 shadow-lg shadow-orange-500/25 transition-colors">
            <Search className="h-3.5 w-3.5 text-white/80" />
            <input
              placeholder="Tìm dự án, nhân sự, mã JIRA..."
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/70 text-white"
            />
            <kbd className="hidden lg:inline text-[10px] font-mono text-white/70 bg-white/20 px-1.5 py-0.5 rounded-md">​</kbd>
          </div>
          <button className="relative p-2 rounded-2xl bg-gray-100 ring-1 ring-gray-200 hover:bg-gray-200 transition-colors">
            <Bell className="h-4 w-4 text-[#1F2937]" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FE9D58]" />
          </button>
        </div>
      </div>
    </header>
  );
}
