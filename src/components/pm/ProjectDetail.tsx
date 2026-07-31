import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { ArrowLeft, Calendar, Users, Wallet, Clock, CheckCircle2, Circle, AlertCircle, Settings, LayoutGrid, Table as TableIcon } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Project, statusMeta, formatVND } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

export function ProjectDetail({ project, onBack, onAdmin }: { project: Project; onBack: () => void; onAdmin?: () => void }) {
  const s = statusMeta[project.status];
  const budgetPct = Math.round((project.budgetUsed / project.budget) * 100);
  const resourcePct = Math.round((project.resourceUsed / project.resourceTotal) * 100);

  const sums = project.trend.reduce((acc, r: any) => {
    acc.resKh += r.resourcePlanned != null ? (project.resourceTotal * r.resourcePlanned) / 100 : 0;
    acc.resTt += r.resourceActual != null ? (project.resourceTotal * r.resourceActual) / 100 : 0;
    acc.budKh += r.budgetPlanned != null ? (project.budget * r.budgetPlanned) / 100 : 0;
    acc.budTt += r.budgetActual != null ? (project.budget * r.budgetActual) / 100 : 0;
    return acc;
  }, { resKh: 0, resTt: 0, budKh: 0, budTt: 0 });


  const [showProgress, setShowProgress] = useState(true);
  const [showBudget, setShowBudget] = useState(true);
  const [showResource, setShowResource] = useState(true);
  const [chartView, setChartView] = useState<"chart" | "table">("chart");

  const filterBtn = (active: boolean, label: string, color: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
        active
          ? "bg-opacity-10 text-foreground border-current"
          : "bg-secondary text-muted-foreground border-transparent opacity-60 hover:opacity-100"
      )}
      style={active ? { color, borderColor: color, backgroundColor: `${color}1a` } : {}}
    >
      <span className={cn("h-2 w-2 rounded-full", active ? "bg-current" : "bg-muted-foreground")} />
      {label}
    </button>
  );

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6 bg-slate-200">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại danh mục
        </button>
        <button onClick={onAdmin} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 shadow-sm shadow-orange-500/30 transition-all">
          <Settings className="h-3.5 w-3.5" /> Quản trị
        </button>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded">{project.code}</span>
              <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border", s.color)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />{s.label}
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">{project.name}</h2>
            <div className="text-sm text-muted-foreground mt-1.5">
              {project.client} · {project.department} · PM <span className="text-foreground font-medium">{project.pm}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tiến độ</div>
            <div className="font-display text-5xl font-semibold tracking-tight font-mono">{project.progress}%</div>
          </div>
        </div>

        <div className="mt-6 h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full", project.status === "overdue" ? "bg-destructive" : "gradient-accent")}
          />
        </div>
      </motion.div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock icon={Calendar} label="Bắt đầu" value={new Date(project.startDate).toLocaleDateString("vi-VN")} />
        <StatBlock icon={Clock} label="Kết thúc" value={new Date(project.deadline).toLocaleDateString("vi-VN")} />
        <StatBlock icon={Users} label="Nhân sự" value={`${project.members.length} người`} />
        <StatBlock icon={Wallet} label="Đã chi" value={`${formatVND(project.budgetUsed)}`} hint={`/ ${formatVND(project.budget)}`} />
      </div>

      {/* Resources & budget */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ResourceBar label="Ngân sách" used={project.budgetUsed} total={project.budget} pct={budgetPct} format={formatVND} />
        <ResourceBar label="Nguồn lực (man-hour)" used={project.resourceUsed} total={project.resourceTotal} pct={resourcePct} />
      </div>

      {/* Trend chart - 6 series */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h3 className="font-display text-lg font-semibold mb-1">Tiến độ thực hiện</h3>
            <p className="text-xs text-muted-foreground">
              So sánh Kế hoạch (đường đứt) và Thực tế (đường liền) theo 3 tiêu chí
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            {chartView === "chart" && (
              <>
                {filterBtn(showProgress, "Tiến độ", "#3b82f6", () => setShowProgress(v => !v))}
                {filterBtn(showBudget, "Ngân sách", "#0d9488", () => setShowBudget(v => !v))}
                {filterBtn(showResource, "Nguồn lực", "#a855f7", () => setShowResource(v => !v))}
              </>
            )}
            <div className="inline-flex items-center rounded-lg border border-border bg-secondary p-0.5 ml-1">
              <button
                onClick={() => setChartView("chart")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all",
                  chartView === "chart" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-3 w-3" /> Biểu đồ
              </button>
              <button
                onClick={() => setChartView("table")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all",
                  chartView === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TableIcon className="h-3 w-3" /> Bảng
              </button>
            </div>
          </div>
        </div>
        {chartView === "chart" ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={project.trend} margin={{ top: 5, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="plainline" />
            {showProgress && (
              <>
                <Line type="monotone" dataKey="planned" name="Tiến độ - Thời gian" stroke="hsl(217 91% 55%)" strokeDasharray="5 4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" name="Tiến độ - Khối lượng CV" stroke="hsl(217 91% 55%)" strokeWidth={2.5} dot={false} />
              </>
            )}
            {showBudget && (
              <>
                <Line type="monotone" dataKey="budgetPlanned" name="Ngân sách - Kế hoạch" stroke="hsl(174 65% 40%)" strokeDasharray="5 4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="budgetActual" name="Ngân sách - Thực tế" stroke="hsl(174 65% 40%)" strokeWidth={2.5} dot={false} />
              </>
            )}
            {showResource && (
              <>
                <Line type="monotone" dataKey="resourcePlanned" name="Nguồn lực - Kế hoạch" stroke="hsl(280 60% 55%)" strokeDasharray="5 4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resourceActual" name="Nguồn lực - Thực tế" stroke="hsl(280 60% 55%)" strokeWidth={2.5} dot={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-left">
                    <th rowSpan={2} className="px-3 py-2.5 font-medium text-foreground border-b border-r border-border sticky left-0 bg-secondary z-10 min-w-[64px]">Tháng</th>
                    <th className="px-2 py-2 font-semibold border-b border-r border-border text-center" style={{ color: "#3b82f6" }} colSpan={3}>Tiến độ (%)</th>
                    <th className="px-2 py-2 font-semibold border-b border-r border-border text-center" style={{ color: "#a855f7" }} colSpan={5}>Nguồn lực</th>
                    <th className="px-2 py-2 font-semibold border-b border-border text-center" style={{ color: "#0d9488" }} colSpan={5}>Ngân sách</th>
                  </tr>
                  <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">Thời gian</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">Khối lượng CV</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">Chênh lệch</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">KH (MD)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">TT (MD)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">KH (%)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">TT (%)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">Chênh lệch</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">KH (VND)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">TT (VND)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">KH (%)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-r border-border bg-secondary text-right">TT (%)</th>
                    <th className="px-2 py-1.5 font-medium border-b border-border bg-secondary text-right">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {project.trend.map((row: any, i: number) => {
                    const groups = [
                      { plan: row.planned, actual: row.actual, goodIfPositive: true, color: "#3b82f6" },
                      {
                        plan: row.resourcePlanned, actual: row.resourceActual, goodIfPositive: false, color: "#a855f7",
                        total: project.resourceTotal,
                        fmtAbs: (n: number) => Math.round(n).toLocaleString("vi-VN"),
                      },
                      {
                        plan: row.budgetPlanned, actual: row.budgetActual, goodIfPositive: false, color: "#0d9488",
                        total: project.budget,
                        fmtAbs: (n: number) => formatVND(Math.round(n)),
                      },
                    ] as any[];
                    return (
                      <tr key={i} className={cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-card" : "bg-secondary/30")}>
                        <td className="px-3 py-2.5 sticky left-0 z-10 font-semibold text-foreground border-r border-border bg-card">{row.week}</td>
                        {groups.map((g, gi) => {
                          const d = g.plan == null || g.actual == null ? null : g.actual - g.plan;
                          const abs = d == null ? 0 : Math.abs(d);
                          const level = abs <= 3 ? 0 : abs <= 10 ? 1 : 2;
                          const good = d == null ? true : g.goodIfPositive ? d >= 0 : d <= 0;
                          const toneCls = good
                            ? ["text-muted-foreground", "bg-success/10 text-success", "bg-success/25 text-success font-bold"]
                            : ["text-muted-foreground", "bg-destructive/10 text-destructive", "bg-destructive/25 text-destructive font-bold"];
                          const arrow = d == null ? "" : d > 0 ? "▲" : d < 0 ? "▼" : "•";
                          const last = gi === groups.length - 1;
                          return (
                            <Fragment key={gi}>
                              {g.total != null && (
                                <>
                                  <td className="px-2.5 py-2 text-right text-muted-foreground border-b border-r border-border">
                                    {g.plan == null ? "—" : g.fmtAbs((g.total * g.plan) / 100)}
                                  </td>
                                  <td className="px-2.5 py-2 text-right font-semibold text-foreground border-b border-r border-border">
                                    {g.actual == null ? "—" : g.fmtAbs((g.total * g.actual) / 100)}
                                  </td>
                                </>
                              )}
                              <td className="px-2.5 py-2 text-right text-muted-foreground border-b border-r border-border">{g.plan ?? "—"}</td>
                              <td className="px-2.5 py-2 text-right border-b border-r border-border relative">
                                <div className="absolute inset-y-1 left-1 rounded-sm" style={{ width: `calc(${g.actual ?? 0}% - 4px)`, backgroundColor: g.color, opacity: 0.16 }} />
                                <span className="relative font-semibold text-foreground">{g.actual ?? "—"}</span>
                              </td>
                              <td className={cn("px-2.5 py-2 text-right border-b border-border", (!last || g.total) && "border-r", toneCls[level])}>
                                {d == null ? (
                                  <span className="text-muted-foreground">—</span>
                                ) : (
                                  <span>{arrow} {d > 0 ? `+${d}` : d}</span>
                                )}
                              </td>
                            </Fragment>
                          );
                        })}
                      </tr>
                    );
                   })}
                   <tr className="bg-secondary/60 border-t-2 border-border">
                     <td className="px-3 py-2.5 sticky left-0 z-10 font-semibold text-foreground border-r border-border bg-secondary">Tổng</td>
                     {/* Tiến độ: 3 empty */}
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     {/* Nguồn lực: KH(MD), TT(MD), KH%, TT%, Chênh lệch */}
                     <td className="px-2.5 py-2 text-right font-semibold text-foreground border-b border-r border-border" style={{ color: "#a855f7" }}>{Math.round(sums.resKh).toLocaleString("vi-VN")}</td>
                     <td className="px-2.5 py-2 text-right font-semibold text-foreground border-b border-r border-border" style={{ color: "#a855f7" }}>{Math.round(sums.resTt).toLocaleString("vi-VN")}</td>
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     {/* Ngân sách: KH(VND), TT(VND), KH%, TT%, Chênh lệch */}
                     <td className="px-2.5 py-2 text-right font-semibold text-foreground border-b border-r border-border" style={{ color: "#0d9488" }}>{formatVND(Math.round(sums.budKh))}</td>
                     <td className="px-2.5 py-2 text-right font-semibold text-foreground border-b border-r border-border" style={{ color: "#0d9488" }}>{formatVND(Math.round(sums.budTt))}</td>
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     <td className="px-2.5 py-2 border-b border-r border-border" />
                     <td className="px-2.5 py-2 border-b border-border" />
                   </tr>
                 </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2.5 bg-secondary/40 border-t border-border text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success/25" /> Thuận lợi</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive/25" /> Lệch nhiều / bất lợi</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-4 rounded-sm" style={{ backgroundColor: "#3b82f6", opacity: 0.16 }} /> Thanh giá trị = độ lớn chỉ số</span>
              <span className="ml-auto">▲ vượt KH · ▼ dưới KH · chênh lệch {">"}10% tô đậm</span>
            </div>
          </div>
        )}
      </div>

      {/* Members + Milestones */}
      <div className="grid lg:grid-cols-[1.3fr,1fr] gap-5">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Nhân sự tham gia dự án</h3>
          <div className="space-y-3">
            {project.members.map((m) => (
              <div key={m.id} className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-4 py-2 border-b border-border last:border-0">
                <div className="h-9 w-9 rounded-full gradient-accent flex items-center justify-center text-xs font-semibold text-white">
                  {m.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground">{m.role}</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Allocation</div>
                  <div className="text-xs font-mono font-medium">{m.allocation}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hiệu suất</div>
                  <div className={cn("text-sm font-semibold font-mono",
                    m.performance >= 90 ? "text-success" : m.performance >= 80 ? "text-info" : "text-warning-foreground")}>
                    {m.performance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Mốc thời gian</h3>
          <div className="relative space-y-4">
            {project.milestones.map((ms, i) => {
              const Icon = ms.status === "done" ? CheckCircle2 : ms.status === "late" ? AlertCircle : Circle;
              const color =
                ms.status === "done" ? "text-success" :
                ms.status === "active" ? "text-info" :
                ms.status === "late" ? "text-destructive" : "text-muted-foreground";
              const statusLabel =
                ms.status === "done" ? "Hoàn thành" :
                ms.status === "active" ? "Đang thực hiện" :
                ms.status === "late" ? "≥ 90%" : "Sắp tới";
              const statusBadge =
                ms.status === "done" ? "bg-success/10 text-success border-success/20" :
                ms.status === "active" ? "bg-info/10 text-info border-info/20" :
                ms.status === "late" ? "bg-destructive/10 text-destructive border-destructive/20" :
                "bg-secondary text-muted-foreground border-border";
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  {i < project.milestones.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-[-12px] w-px bg-border" />
                  )}
                  <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0 bg-card", color)} strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{ms.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {new Date(ms.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <span className={cn("flex-shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wide", statusBadge)}>
                    {statusLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ icon: Icon, label, value, hint }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      </div>
      <div className="font-display text-lg font-semibold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground font-mono mt-0.5">{hint}</div>}
    </div>
  );
}

function ResourceBar({ label, used, total, pct, format }: { label: string; used: number; total: number; pct: number; format?: (n: number) => string }) {
  const fmt = format ?? ((n: number) => n.toLocaleString("vi-VN"));
  const danger = pct > 90;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn("font-mono text-sm font-semibold", danger ? "text-destructive" : "")}>{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }}
          className={cn("h-full", danger ? "bg-destructive" : "gradient-accent")}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>Đã dùng: <span className="text-foreground">{fmt(used)}</span></span>
        <span>Tổng: {fmt(total)}</span>
      </div>
    </div>
  );
}
