import { motion } from "framer-motion";
import { FolderKanban, Activity, CheckCircle2, AlertTriangle, Target, Zap, Calendar, LayoutGrid, List, ArrowUpRight } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, BarChart, Bar, Legend, RadialBarChart, RadialBar, PolarAngleAxis, Treemap, Sector
} from "recharts";
import { KpiCard } from "./KpiCard";
import { ProjectCard } from "./ProjectCard";
import { projects, companyTrend, departmentLoad, departmentAllocation, departmentAllocationHistory, statusMeta, Project } from "@/lib/mockData";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


interface Props { onSelectProject: (p: Project) => void }

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "0 8px 24px hsl(222 47% 11% / 0.12)",
};

export function Dashboard({ onSelectProject }: Props) {
  const total = projects.length;
  const active = projects.filter(p => p.status === "active").length;
  const done = projects.filter(p => p.status === "done").length;
  const overdue = projects.filter(p => p.status === "overdue").length;
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / total);
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const usedBudget = projects.reduce((s, p) => s + p.budgetUsed, 0);

  const [selectedMonth, setSelectedMonth] = useState<string>("05");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const departmentOptions = useMemo(() => {
    const values = Array.from(new Set(projects.map(p => p.department || ""))).sort();
    return values.map(d => ({ value: d, label: d || "(Chưa có)" }));
  }, []);
  const allocationKey = `${selectedYear}-${selectedMonth}`;
  const allocationData = departmentAllocationHistory[allocationKey] || departmentAllocation;

  const months = [
    { value: "01", label: "Tháng 1" }, { value: "02", label: "Tháng 2" }, { value: "03", label: "Tháng 3" },
    { value: "04", label: "Tháng 4" }, { value: "05", label: "Tháng 5" }, { value: "06", label: "Tháng 6" },
    { value: "07", label: "Tháng 7" }, { value: "08", label: "Tháng 8" }, { value: "09", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" }, { value: "11", label: "Tháng 11" }, { value: "12", label: "Tháng 12" },
  ];
  const years = ["2024", "2025", "2026"];


  return (
    <div className="px-6 lg:px-10 py-8 space-y-8 bg-slate-200">
      {/* Hero strip */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-white p-4 lg:p-5"
      >
        <div className="absolute inset-0 grid-pattern opacity-[0.04] border-transparent" />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full gradient-accent opacity-30 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.4fr,1fr] gap-4 items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/10 border border-background/20 text-[10px] uppercase tracking-[0.2em] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Cập nhật trực tiếp · 06.05.2026
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-balance leading-[1.05] text-gray-950">
              Thống kê tổng hợp: <br /><span className="text-info text-slate-50">20 dự án</span> đang vận hành.
            </h2>
            <p className="mt-2 text-sm text-background/70 max-w-xl whitespace-pre-line text-slate-950">
              Nguồn lực sử dụng trung bình đạt {avgProgress}% so với kế hoạch.{"\n"}1 dự án cần can thiệp ngay từ ban điều hành.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-background/60 mb-1 text-slate-950">Tổng ngân sách</div>
              <div className="font-display text-xl font-semibold text-slate-950">{(totalBudget / 1e9).toFixed(1)} tỷ</div>
              <div className="text-xs text-background/60 mt-1 text-slate-950">Đã chi {Math.round(usedBudget / totalBudget * 100)}%</div>
            </div>
            <div className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-background/60 mb-1 text-slate-950">Nguồn lực sử dụng</div>
              <div className="font-display text-xl font-semibold flex items-baseline gap-1 text-slate-950">
                {avgProgress}<span className="text-sm text-background/60 text-slate-950">/100</span>
              </div>
              <div className="text-xs text-success mt-1 text-yellow-300">▲ +6.2 vs tháng trước</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        <KpiCard index={0} label="Tổng dự án" value={20} hint={"7 Phát triển - 10 Bảo trì - 3 Nghiên cứu"} icon={FolderKanban} delta={12} />
        <KpiCard index={1} label="Đang thực hiện" value={2} hint="Trong tiến độ" icon={Activity} accent="info" delta={4} />
        <KpiCard index={2} label="Hoàn thành" value={2} hint={"Sàn hàng hóa - 10/4/2026\nOMS - 12/4/2026"} icon={CheckCircle2} accent="success" delta={20} />
        <KpiCard index={3} label="Quá hạn" value={overdue} hint="HDB - Cần can thiệp" icon={AlertTriangle} accent="destructive" delta={-8} />
        <KpiCard index={4} label="Nguồn lực sử dụng" value={`${avgProgress}%`} hint="So với kế hoạch" icon={Target} accent="warning" delta={6} />
      </section>

      {/* Charts row */}
      <section className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold">Số ngày thực hiện </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Số ngày đã thực hiện / tổng số ngày kế hoạch theo dự án</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(152 60% 42%)" }} />&lt; 70%</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(38 92% 50%)" }} />70-90%</span>
              <span className="flex items-center gap-1.5 whitespace-pre-wrap"><span className="h-2 w-2 rounded-sm shrink-0" style={{ background: "hsl(0 78% 55%)" }} />≥{"\n"}90%</span>
            </div>
          </div>
          {(() => {
            const now = Date.now();
            const timeData = projects.map((p) => {
              const start = new Date(p.startDate).getTime();
              const end = new Date(p.deadline).getTime();
              const totalDays = Math.max(1, Math.round((end - start) / 86400000));
              const elapsed = Math.max(0, Math.min(totalDays, Math.round((now - start) / 86400000)));
              const planned = Math.round((elapsed / totalDays) * 100);
              const gap = planned - p.progress;
              const color = gap > 15 ? "hsl(0 78% 55%)" : gap > 5 ? "hsl(38 92% 50%)" : "hsl(152 60% 42%)";
              return { name: p.code, elapsed, totalDays, pct: planned, color };
            }).sort((a, b) => b.pct - a.pct);
            return (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {timeData.map((d) => {
                  const widthPct = Math.min(100, (d.elapsed / d.totalDays) * 100);
                  return (
                    <div key={d.name} className="grid grid-cols-[64px,1fr,auto] items-center gap-3 text-xs">
                      <span className="font-mono font-semibold text-foreground">{d.name}</span>
                      <div className="relative h-5 rounded-md bg-secondary overflow-hidden">
                        <div className="h-full rounded-md transition-all flex items-center px-2" style={{ width: `${widthPct}%`, background: d.color }}>
                          <span className="text-[10px] font-mono font-semibold whitespace-nowrap drop-shadow-sm text-gray-950">
                            {d.elapsed} / {d.totalDays} ngày
                          </span>
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-muted-foreground text-gray-950">
                          {d.pct}%
                        </span>
                      </div>
                      <span className="font-mono text-[10px]" style={{ color: d.color }}>●</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Phân bổ theo phòng ban</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Kế hoạch vs thực tế (%)</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-8 w-[110px] text-xs px-2">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs">{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-8 w-[90px] text-xs px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground mb-2">
            Dữ liệu tháng {parseInt(selectedMonth, 10)}/{selectedYear}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={allocationData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={1} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--secondary) / 0.5)" }} />
              <Bar dataKey="planned" fill="hsl(217 15% 65%)" radius={[4, 4, 0, 0]} maxBarSize={18} name="Kế hoạch" />
              <Bar dataKey="actual" fill="hsl(217 91% 55%)" radius={[4, 4, 0, 0]} maxBarSize={18} name="Thực tế" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 text-[11px] mt-2">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(217 15% 65%)" }} />Kế hoạch</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(217 91% 55%)" }} />Thực tế</span>
          </div>
        </div>
      </section>

      {/* Effort usage + Bug summary */}
      <section className="grid lg:grid-cols-2 gap-5">
        {/* Effort usage block - Horizontal stacked bar chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-info" /> Effort sử dụng
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Man-day đã tiêu thụ / kế hoạch theo dự án</p>
            </div>
          </div>
          {(() => {
            const effortData = projects
              .map((p) => ({
                name: p.code,
                used: p.resourceUsed,
                remaining: Math.max(0, p.resourceTotal - p.resourceUsed),
                total: p.resourceTotal,
                pct: Math.round((p.resourceUsed / p.resourceTotal) * 100),
              }))
              .sort((a, b) => b.pct - a.pct);
            const totalUsed = effortData.reduce((s, d) => s + d.used, 0);
            const totalPlan = effortData.reduce((s, d) => s + d.total, 0);
            const colorFor = (pct: number) =>
              pct >= 90 ? "hsl(0 78% 55%)" : pct >= 70 ? "hsl(38 92% 50%)" : "hsl(152 60% 42%)";
            return (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display text-3xl font-semibold">{totalUsed.toLocaleString("vi-VN")}<span className="text-sm text-muted-foreground font-normal"> / {totalPlan.toLocaleString("vi-VN")} MD</span></div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Tổng man-day đã dùng / kế hoạch</div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(152 60% 42%)" }} />&lt; 70%</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(38 92% 50%)" }} />70-90%</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: "hsl(0 78% 55%)" }} />≥ 90%</span>
                  </div>
                </div>
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {effortData.map((d) => {
                    const c = colorFor(d.pct);
                    const widthPct = Math.min(100, (d.used / d.total) * 100);
                    return (
                      <div key={d.name} className="grid grid-cols-[56px,1fr,auto] items-center gap-3 text-xs">
                        <span className="font-mono font-semibold text-foreground">{d.name}</span>
                        <div className="relative h-5 rounded-md bg-secondary overflow-hidden">
                          <div className="h-full rounded-md transition-all flex items-center px-2" style={{ width: `${widthPct}%`, background: c }}>
                            <span className="text-[10px] font-mono font-semibold whitespace-nowrap drop-shadow-sm text-gray-950">
                              {d.used} / {d.total} MD
                            </span>
                          </div>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-muted-foreground text-gray-950">
                            {d.pct}%
                          </span>
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: c }}>●</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bug summary - Donut chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Tổng hợp bug
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Số bug chưa xử lý tính đến thời điểm báo cáo</p>
            </div>
          </div>
          {(() => {
            const palette = [
              "hsl(217 91% 55%)","hsl(0 78% 55%)","hsl(38 92% 50%)","hsl(152 60% 42%)",
              "hsl(280 60% 55%)","hsl(14 80% 52%)","hsl(199 89% 48%)","hsl(340 75% 55%)",
            ];
            const bugData = projects.map((p, i) => {
              const seed = p.code.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
              const open = (seed % 18) + 3;
              return { name: p.code, value: open, color: palette[i % palette.length] };
            });
            const total = bugData.reduce((s, d) => s + d.value, 0);
            const max = Math.max(...bugData.map(d => d.value));
            const sorted = [...bugData].sort((a, b) => b.value - a.value);
            const RoseShape = (props: any) => {
              const { cx, cy, startAngle, endAngle, fill, payload } = props;
              const inner = 38;
              const outer = inner + 18 + (payload.value / max) * 70;
              return (
                <g>
                  <Sector
                    cx={cx} cy={cy}
                    innerRadius={inner} outerRadius={outer}
                    startAngle={startAngle} endAngle={endAngle}
                    fill={fill}
                    stroke="hsl(var(--card))" strokeWidth={2}
                    cornerRadius={4}
                  />
                  <Sector
                    cx={cx} cy={cy}
                    innerRadius={inner - 6} outerRadius={inner - 2}
                    startAngle={startAngle} endAngle={endAngle}
                    fill={fill}
                    opacity={0.35}
                  />
                </g>
              );
            };
            return (
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display text-3xl font-semibold">{total}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Tổng bug </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">​</div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <defs>
                      <radialGradient id="bugCenter">
                        <stop offset="0%" stopColor="hsl(var(--destructive) / 0.15)" />
                        <stop offset="100%" stopColor="hsl(var(--card))" />
                      </radialGradient>
                    </defs>
                    <circle cx="50%" cy="50%" r="34" fill="url(#bugCenter)" />
                    <Pie
                      data={sorted}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      innerRadius={38}
                      outerRadius={120}
                      paddingAngle={2}
                      activeIndex={sorted.map((_, i) => i)}
                      activeShape={RoseShape as any}
                      isAnimationActive
                    >
                      {sorted.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-foreground" fontSize={14} fontWeight={700} fontFamily="monospace">{total}</text>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any, _n: any, p: any) => [`${v} bug (${Math.round(v / total * 100)}%)`, p.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-x-3 gap-y-1.5 pt-1">
                  {sorted.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <span className="font-mono">{d.name}</span>
                      <span className="text-muted-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Project grid / table */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">Danh mục dự án</h3>
            <p className="text-sm text-muted-foreground mt-1">Click để xem chi tiết và đánh giá hiệu suất</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {viewMode === "table" && (
              <>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm mã / tên dự án..."
                  className="h-8 w-56 text-xs"
                />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="h-8 w-[150px] text-xs px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">Tất cả phòng ban</SelectItem>
                    {departmentOptions.map((d) => (
                      <SelectItem key={d.value} value={d.value} className="text-xs">{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[140px] text-xs px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Tất cả trạng thái</SelectItem>
                <SelectItem value="active" className="text-xs">Đang chạy</SelectItem>
                <SelectItem value="overdue" className="text-xs">Quá hạn</SelectItem>
                <SelectItem value="done" className="text-xs">Hoàn thành</SelectItem>
                <SelectItem value="planning" className="text-xs">Kế hoạch</SelectItem>
                <SelectItem value="onhold" className="text-xs">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setViewMode("card")}
                className={cn("px-2.5 py-1.5 flex items-center gap-1.5 transition-colors",
                  viewMode === "card" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary")}
                title="Dạng thẻ"
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Thẻ
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn("px-2.5 py-1.5 flex items-center gap-1.5 transition-colors border-l border-border",
                  viewMode === "table" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary")}
                title="Dạng bảng"
              >
                <List className="h-3.5 w-3.5" /> Bảng
              </button>
            </div>
          </div>
        </div>
        {(() => {
          const filtered = projects.filter(p => {
            const matchStatus = statusFilter === "all" || p.status === statusFilter;
            const q = searchTerm.trim().toLowerCase();
            const matchSearch = !q || p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
            const matchDept = departmentFilter === "all" || (departmentFilter === "" ? !p.department : p.department === departmentFilter);
            return matchStatus && matchSearch && matchDept;
          });
          if (viewMode === "card") {
            return (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} onClick={() => onSelectProject(p)} />
                ))}
              </div>
            );
          }
          return (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="text-left px-3 py-2.5 font-semibold">STT</th>
                      <th className="text-left px-3 py-2.5 font-semibold">Mã dự án</th>
                      <th className="text-left px-3 py-2.5 font-semibold min-w-[220px]">Tên dự án</th>
                      <th className="text-left px-3 py-2.5 font-semibold">Loại</th>
                      <th className="text-left px-3 py-2.5 font-semibold">PM</th>
                      <th className="text-left px-3 py-2.5 font-semibold">Phòng ban</th>
                      <th className="text-left px-3 py-2.5 font-semibold">Trạng thái</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Tiến độ</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Ngân sách</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Nguồn lực</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Thời gian</th>
                      <th className="text-left px-3 py-2.5 font-semibold">Bắt đầu</th>
                      <th className="text-left px-3 py-2.5 font-semibold">Hạn</th>
                      <th className="px-3 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => {
                      const s = statusMeta[p.status];
                      const budgetPct = Math.round((p.budgetUsed / p.budget) * 100);
                      const resourcePct = Math.round((p.resourceUsed / p.resourceTotal) * 100);
                      const now = Date.now();
                      const startTime = new Date(p.startDate).getTime();
                      const endTime = new Date(p.deadline).getTime();
                      const totalDays = Math.max(1, Math.round((endTime - startTime) / 86400000));
                      const elapsed = Math.max(0, Math.min(totalDays, Math.round((now - startTime) / 86400000)));
                      const timePct = Math.round((elapsed / totalDays) * 100);
                      return (
                        <tr
                          key={p.id}
                          onClick={() => onSelectProject(p)}
                          className="border-t border-border hover:bg-secondary/40 cursor-pointer transition-colors"
                        >
                          <td className="px-3 py-2 font-mono text-muted-foreground">{i + 1}</td>
                          <td className="px-3 py-2 font-mono font-semibold">{p.code}</td>
                          <td className="px-3 py-2">
                            <div className="font-medium truncate max-w-[280px]">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground truncate max-w-[280px]">{p.client}</div>
                          </td>
                          <td className="px-3 py-2">{p.type}</td>
                          <td className="px-3 py-2">{p.pm}</td>
                          <td className="px-3 py-2 text-muted-foreground">{p.department}</td>
                          <td className="px-3 py-2">
                            <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border", s.color)}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                              {s.label}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-semibold">{p.progress}%</td>
                          <td className={cn("px-3 py-2 text-right font-mono", budgetPct > 90 ? "text-destructive font-semibold" : "")}>{budgetPct}%</td>
                          <td className={cn("px-3 py-2 text-right font-mono", resourcePct > 90 ? "text-destructive font-semibold" : "")}>{resourcePct}%</td>
                          <td className={cn("px-3 py-2 text-right font-mono", timePct > 90 ? "text-destructive font-semibold" : "")}>{timePct}%</td>
                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{p.startDate}</td>
                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{p.deadline}</td>
                          <td className="px-3 py-2">
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={13} className="text-center text-muted-foreground py-8">Không có dự án phù hợp</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border bg-secondary/30">
                Hiển thị {filtered.length} / {projects.length} dự án
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
