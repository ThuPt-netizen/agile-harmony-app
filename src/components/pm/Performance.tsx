import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { allMembers, projects } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

export function Performance() {
  const sorted = [...allMembers].sort((a, b) => b.performance - a.performance);
  const top = sorted[0];
  const radarData = [
    { metric: "Velocity", value: 88 },
    { metric: "Chất lượng", value: 92 },
    { metric: "Đúng hạn", value: 78 },
    { metric: "Hợp tác", value: 95 },
    { metric: "Sáng tạo", value: 82 },
    { metric: "Chủ động", value: 90 },
  ];

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6 bg-slate-200">
      <motion.section
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-[1.4fr,1fr] gap-5"
      >
        <div className="rounded-2xl border border-border bg-card p-7">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            <Trophy className="h-3.5 w-3.5 text-warning" /> Top performer · Q2/2026
          </div>
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-2xl gradient-accent flex items-center justify-center text-2xl font-display font-bold text-white shadow-glow">
              {top.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-2xl font-semibold tracking-tight">{top.name}</h2>
              <div className="text-sm text-muted-foreground">{top.role}</div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Điểm</div>
                  <div className="font-display text-2xl font-semibold text-success">{top.performance}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tasks</div>
                  <div className="font-display text-2xl font-semibold font-mono">{top.tasksDone}/{top.tasksTotal}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Allocation</div>
                  <div className="font-display text-2xl font-semibold font-mono">{top.allocation}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7">
          <h3 className="font-display text-lg font-semibold">Hồ sơ năng lực</h3>
          <p className="text-xs text-muted-foreground mb-2">{top.name}</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar dataKey="value" stroke="hsl(217 91% 55%)" fill="hsl(217 91% 55%)" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Bảng xếp hạng hiệu suất
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Điểm tổng hợp dựa trên velocity, chất lượng & đúng hạn</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="avatar" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--secondary) / 0.5)" }} />
            <Bar dataKey="performance" fill="hsl(var(--foreground))" radius={[0, 6, 6, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Đánh giá cá nhân</h3>
          <span className="text-xs text-muted-foreground">{allMembers.length} thành viên</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground border-b border-border">
                <th className="text-left font-medium px-6 py-3">Thành viên</th>
                <th className="text-left font-medium px-4 py-3">Vai trò</th>
                <th className="text-left font-medium px-4 py-3">Allocation theo dự án</th>
                <th className="text-right font-medium px-4 py-3">Điểm meicoin</th>
                <th className="text-center font-medium px-4 py-3">Điểm nội quy</th>
                <th className="text-center font-medium px-6 py-3">Xếp hạng chung</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => {
                // Find projects this member is allocated to
                const memberProjects = projects.filter(p => p.members.some(mm => mm.id === m.id));
                // Distribute allocation across joined projects deterministically
                const total = m.allocation;
                const count = Math.max(memberProjects.length, 1);
                const seed = m.id.charCodeAt(1) || 1;
                const weights = memberProjects.map((_, idx) => 1 + ((seed * (idx + 3)) % 5) / 10);
                const wSum = weights.reduce((a, b) => a + b, 0) || 1;
                const allocs = memberProjects.map((_, idx) =>
                  Math.round((weights[idx] / wSum) * total)
                );
                // Adjust last to match total
                if (allocs.length) {
                  const diff = total - allocs.reduce((a, b) => a + b, 0);
                  allocs[allocs.length - 1] += diff;
                }

                const meicoin = Math.round(m.performance * 12 + (seed * 37) % 180);
                const ruleScoreIdx = m.performance >= 90 ? 0 : m.performance >= 84 ? 1 : m.performance >= 78 ? 2 : 3;
                const ruleLabels = ["Tốt", "Khá", "TB", "Yếu"];
                const ruleColors = ["text-success", "text-info", "text-warning-foreground", "text-destructive"];
                const rankIdx = m.performance >= 90 ? 0 : m.performance >= 85 ? 1 : m.performance >= 80 ? 2 : 3;
                const rankLabels = ["A", "B", "C", "D"];
                const rankColors = [
                  "bg-success/15 text-success border-success/30",
                  "bg-info/15 text-info border-info/30",
                  "bg-warning/15 text-warning-foreground border-warning/30",
                  "bg-destructive/15 text-destructive border-destructive/30",
                ];

                return (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors align-top">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-muted-foreground font-mono w-4">{i + 1}</div>
                        <div className="h-8 w-8 rounded-full gradient-accent flex items-center justify-center text-[10px] font-semibold text-white">{m.avatar}</div>
                        <div className="font-medium">{m.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                    <td className="px-4 py-3">
                      {memberProjects.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">Chưa phân bổ</span>
                      ) : (
                        <div className="space-y-1.5 min-w-[220px]">
                          {memberProjects.map((p, idx) => (
                            <div key={p.id} className="flex items-center gap-2">
                              <div className="text-xs font-medium truncate flex-1">{p.code} · {p.name}</div>
                              <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full gradient-accent" style={{ width: `${Math.min(allocs[idx] * 1.5, 100)}%` }} />
                              </div>
                              <span className="font-mono text-xs w-9 text-right">{allocs[idx]}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono font-semibold text-base text-warning-foreground">{meicoin.toLocaleString("vi-VN")}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("font-medium text-sm", ruleColors[ruleScoreIdx])}>{ruleLabels[ruleScoreIdx]}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={cn("inline-flex items-center justify-center h-8 w-8 rounded-lg border font-display font-bold text-base", rankColors[rankIdx])}>
                        {rankLabels[rankIdx]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
