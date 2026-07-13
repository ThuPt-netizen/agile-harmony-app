import { motion } from "framer-motion";
import { Calendar, Users, ArrowUpRight } from "lucide-react";
import { Project, statusMeta, priorityMeta, formatVND } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, onClick, index = 0 }: { project: Project; onClick?: () => void; index?: number }) {
  const s = statusMeta[project.status];
  const p = priorityMeta[project.priority];
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000);
  const budgetPct = Math.round((project.budgetUsed / project.budget) * 100);
  const resourcePct = Math.round((project.resourceUsed / project.resourceTotal) * 100);
  const startTime = new Date(project.startDate).getTime();
  const endTime = new Date(project.deadline).getTime();
  const totalDays = Math.max(1, Math.round((endTime - startTime) / 86400000));
  const elapsed = Math.max(0, Math.min(totalDays, Math.round((Date.now() - startTime) / 86400000)));
  const timePct = Math.round((elapsed / totalDays) * 100);
  const budgetTy = (project.budget / 1_000_000_000).toFixed(1);

  const barColor = (pct: number) =>
    pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-warning" : "bg-success";

  const typeColor =
    project.type === "Phát triển" ? "bg-info/10 text-info border-info/20" :
    project.type === "Nghiên cứu" ? "bg-accent/10 text-accent border-accent/20" :
    "bg-muted text-muted-foreground border-border";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={onClick}
      className="group text-left w-full rounded-xl border border-border bg-card p-5 hover:border-foreground/30 hover:shadow-elegant transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
              {project.code}
            </span>
            <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border", s.color)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
              {s.label}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold leading-tight truncate group-hover:text-accent transition-colors">
            {project.name}
          </h3>
          <div className="text-xs text-muted-foreground mt-0.5">{project.client} · {project.department}</div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>

      {/* Tiến độ */}
      <div className="mb-2.5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Tiến độ</span>
          <span className="font-mono text-sm font-semibold">{project.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.04, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              project.status === "overdue" ? "bg-destructive" :
              project.status === "done" ? "bg-success" : "gradient-accent"
            )}
          />
        </div>
      </div>

      {/* Ngân sách */}
      <div className="mb-2.5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Ngân sách</span>
          <span className={cn("font-mono text-xs font-semibold", budgetPct > 90 ? "text-destructive" : "")}>{budgetPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, budgetPct)}%` }}
            transition={{ duration: 0.8, delay: 0.25 + index * 0.04, ease: "easeOut" }}
            className={cn("h-full rounded-full", barColor(budgetPct))}
          />
        </div>
      </div>

      {/* Nguồn lực */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Nguồn lực</span>
          <span className={cn("font-mono text-xs font-semibold", resourcePct > 90 ? "text-destructive" : "")}>{resourcePct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, resourcePct)}%` }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.04, ease: "easeOut" }}
            className={cn("h-full rounded-full", barColor(resourcePct))}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Số ngày còn lại</div>
          <div className="flex items-center gap-1 text-xs font-medium">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className={daysLeft < 0 ? "text-destructive" : ""}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)}d trễ` : `${daysLeft}d`}
            </span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Team</div>
          <div className="flex items-center gap-1 text-xs font-medium">
            <Users className="h-3 w-3 text-muted-foreground" />
            {project.members.length} người
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Ngân sách</div>
          <div className="text-xs font-medium font-mono">{budgetTy} tỷ</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border gap-2">
        <span className="text-xs font-medium text-foreground truncate">{project.pm}</span>
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap", typeColor)}>
          {project.type}
        </span>
      </div>
    </motion.button>
  );
}
