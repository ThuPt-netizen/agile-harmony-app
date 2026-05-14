import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  delta?: number;
  icon: LucideIcon;
  accent?: "default" | "success" | "warning" | "destructive" | "info";
  index?: number;
}

const accentMap = {
  default: "bg-foreground/5 text-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function KpiCard({ label, value, hint, delta, icon: Icon, accent = "default", index = 0 }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow-elegant transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", accentMap[accent])}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </div>
        {delta !== undefined && (
          <div className={cn("flex items-center gap-1 text-[11px] font-medium font-mono", positive ? "text-success" : "text-destructive")}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}{delta}%
          </div>
        )}
      </div>
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5">{label}</div>
      <div className="font-display text-xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground whitespace-pre-line">{hint}</div>}
    </motion.div>
  );
}
