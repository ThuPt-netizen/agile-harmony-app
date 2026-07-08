export type ProjectStatus = "active" | "planning" | "done" | "onhold" | "overdue";
export type Priority = "low" | "medium" | "high" | "critical";
export type ProjectType = "Phát triển" | "Bảo trì" | "Nghiên cứu";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  allocation: number;
  performance: number;
  tasksDone: number;
  tasksTotal: number;
}

export interface Milestone {
  name: string;
  date: string;
  status: "done" | "active" | "upcoming" | "late";
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  startDate: string;
  deadline: string;
  pm: string;
  department: string;
  budget: number;
  budgetUsed: number;
  resourceTotal: number;
  resourceUsed: number;
  members: Member[];
  milestones: Milestone[];
  trend: {
    week: string;
    planned: number;
    actual: number;
    budgetPlanned: number;
    budgetActual: number;
    resourcePlanned: number;
    resourceActual: number;
  }[];
  type: ProjectType;
}

const teamPool: Member[] = [
  { id: "u1", name: "PM: Bùi Ngọc Anh", role: "Project Manager", avatar: "NK", allocation: 80, performance: 92, tasksDone: 48, tasksTotal: 52 },
  { id: "u2", name: "PM: Bùi Ngọc Anh", role: "Tech Lead", avatar: "TH", allocation: 100, performance: 88, tasksDone: 64, tasksTotal: 71 },
  { id: "u3", name: "PM: Lê Quốc Bảo", role: "Senior Backend", avatar: "LB", allocation: 100, performance: 95, tasksDone: 81, tasksTotal: 84 },
  { id: "u4", name: "Phạm Thu Hà", role: "Frontend Dev", avatar: "PH", allocation: 75, performance: 78, tasksDone: 42, tasksTotal: 55 },
  { id: "u5", name: "Đỗ Văn Sơn", role: "QA Engineer", avatar: "ĐS", allocation: 50, performance: 84, tasksDone: 38, tasksTotal: 45 },
  { id: "u6", name: "PM: Vũ Mai Linh", role: "Business Analyst", avatar: "VL", allocation: 60, performance: 90, tasksDone: 29, tasksTotal: 32 },
  { id: "u7", name: "PM: Hoàng Trung Kiên", role: "DevOps", avatar: "HK", allocation: 40, performance: 87, tasksDone: 22, tasksTotal: 26 },
  { id: "u8", name: "PM: Bùi Ngọc Anh", role: "UI/UX Designer", avatar: "BA", allocation: 70, performance: 81, tasksDone: 31, tasksTotal: 39 },
];

const trend = (progressEnd: number, budgetEnd: number, resourceEnd: number) => {
  const series = (end: number, jitter: number) =>
    Array.from({ length: 12 }, (_, i) => {
      const t = i / 11;
      const planned = Math.round(end * t);
      const actual = Math.round(end * t * (1 - jitter / 2 + Math.random() * jitter));
      return { planned, actual: Math.max(0, Math.min(100, actual)) };
    });
  const p = series(progressEnd, 0.18);
  const b = series(budgetEnd, 0.14);
  const r = series(resourceEnd, 0.16);
  return Array.from({ length: 12 }, (_, i) => ({
    week: `T${i + 1}`,
    planned: p[i].planned,
    actual: p[i].actual,
    budgetPlanned: b[i].planned,
    budgetActual: b[i].actual,
    resourcePlanned: r[i].planned,
    resourceActual: r[i].actual,
  }));
};

export const projects: Project[] = [
  {
    id: "p1", code: "CG5", name: "Core gen 5", client: "​Hệ thống CORE- Công ty chứng khoán",
    status: "active", priority: "critical", progress: 68,
    startDate: "2025-08-01", deadline: "2026-07-30",
    pm: "PM: Bùi Ngọc Anh", department: "Enterprise",
    budget: 4_800_000_000, budgetUsed: 3_120_000_000,
    resourceTotal: 4200, resourceUsed: 2856,
    members: teamPool.slice(0, 6),
    milestones: [
      { name: "Kickoff & Discovery", date: "2025-08-15", status: "done" },
      { name: "Module Auth & KYC", date: "2025-11-30", status: "done" },
      { name: "Core Transaction", date: "2026-03-15", status: "active" },
      { name: "UAT", date: "2026-06-01", status: "upcoming" },
      { name: "Go-live", date: "2026-07-30", status: "upcoming" },
    ],
    trend: trend(68, 65, 68), type: "Phát triển",
  },
  {
    id: "p2", code: "HDBCD", name: "HDB.CD.2025", client: "​Hệ thống quản lý và giao dịch GTCG",
    status: "active", priority: "high", progress: 84,
    startDate: "2025-05-10", deadline: "2026-05-20",
    pm: "PM: Bùi Ngọc Anh", department: "",
    budget: 2_400_000_000, budgetUsed: 2_010_000_000,
    resourceTotal: 2800, resourceUsed: 2360,
    members: [teamPool[1], teamPool[2], teamPool[3], teamPool[7]],
    milestones: [
      { name: "MVP Release", date: "2025-09-20", status: "done" },
      { name: "Payment Integration", date: "2025-12-15", status: "done" },
      { name: "Mobile App", date: "2026-04-01", status: "active" },
      { name: "Launch", date: "2026-05-20", status: "upcoming" },
    ],
    trend: trend(84, 84, 84), type: "Phát triển",
  },
  {
    id: "p3", code: "MSBDSB", name: "MSB.DSB.2026", client: "Hệ thống lưu ký giám sát cho ngân hàng giám sát MSB",
    status: "overdue", priority: "high", progress: 52,
    startDate: "2025-03-01", deadline: "2026-04-15",
    pm: "PM: Lê Quốc Bảo", department: "",
    budget: 980_000_000, budgetUsed: 890_000_000,
    resourceTotal: 1600, resourceUsed: 1520,
    members: [teamPool[2], teamPool[4], teamPool[5]],
    milestones: [
      { name: "Requirement Frozen", date: "2025-04-10", status: "done" },
      { name: "Payroll Module", date: "2025-09-01", status: "done" },
      { name: "Performance Review", date: "2026-02-15", status: "late" },
      { name: "Roll-out", date: "2026-04-15", status: "upcoming" },
    ],
    trend: trend(52, 91, 95), type: "Bảo trì",
  },
  {
    id: "p4", code: "HNXCAR", name: "​HNX.Carbon.2025", client: "Hệ thống giao dịch Cacbon",
    status: "active", priority: "high", progress: 62,
    startDate: "2025-10-01", deadline: "2026-12-30",
    pm: "PM: Vũ Mai Linh", department: "Nhà nước",
    budget: 6_200_000_000, budgetUsed: 1_980_000_000,
    resourceTotal: 5600, resourceUsed: 2240,
    members: [teamPool[5], teamPool[2], teamPool[6], teamPool[1]],
    milestones: [
      { name: "Architecture Review", date: "2025-11-15", status: "done" },
      { name: "Ingestion Pipeline", date: "2026-04-30", status: "active" },
      { name: "ML Workbench", date: "2026-09-30", status: "upcoming" },
      { name: "Production", date: "2026-12-30", status: "upcoming" },
    ],
    trend: trend(62, 32, 40), type: "Nghiên cứu",
  },
  {
    id: "p5", code: "SHH", name: "Sàn hàng hóa.2026", client: "Hệ thống giao dịch Sàn hàng hóa",
    status: "done", priority: "medium", progress: 100,
    startDate: "2024-06-01", deadline: "2025-12-20",
    pm: "PM: Bùi Ngọc Anh", department: "Enterprise",
    budget: 3_100_000_000, budgetUsed: 2_980_000_000,
    resourceTotal: 3600, resourceUsed: 3520,
    members: [teamPool[1], teamPool[3], teamPool[4], teamPool[7]],
    milestones: [
      { name: "Beta", date: "2025-06-30", status: "done" },
      { name: "GA Release", date: "2025-12-20", status: "done" },
    ],
    trend: trend(100, 96, 98), type: "Phát triển",
  },
  {
    id: "p6", code: "VNX", name: "VNX.2026", client: "Hệ thống quản trị và cổng thông tin điện tử VNX",
    status: "planning", priority: "medium", progress: 8,
    startDate: "2026-04-01", deadline: "2027-03-30",
    pm: "PM: Hoàng Trung Kiên", department: "VNX",
    budget: 1_700_000_000, budgetUsed: 95_000_000,
    resourceTotal: 2400, resourceUsed: 180,
    members: [teamPool[6], teamPool[2], teamPool[5]],
    milestones: [
      { name: "Technical Proposal", date: "2026-04-30", status: "active" },
      { name: "Prototype", date: "2026-09-30", status: "upcoming" },
    ],
    trend: trend(8, 6, 8), type: "Nghiên cứu",
  },
  {
    id: "p7", code: "VTC", name: "Vietincapital.2026", client: "Hệ thống phần mềm Quản lý quỹ",
    status: "active", priority: "medium", progress: 72,
    startDate: "2025-02-15", deadline: "2026-06-30",
    pm: "PM: Bùi Ngọc Anh", department: "Quản lý quỹ",
    budget: 2_900_000_000, budgetUsed: 2_140_000_000,
    resourceTotal: 3200, resourceUsed: 2350,
    members: [teamPool[7], teamPool[3], teamPool[4], teamPool[5]],
    milestones: [
      { name: "Discovery", date: "2025-03-20", status: "done" },
      { name: "Customer Module", date: "2025-10-30", status: "done" },
      { name: "Claim Engine", date: "2026-04-30", status: "active" },
      { name: "Go-live", date: "2026-06-30", status: "upcoming" },
    ],
    trend: trend(72, 74, 73), type: "Bảo trì",
  },
];

export const companyTrend = Array.from({ length: 12 }, (_, i) => {
  const months = ["T6","T7","T8","T9","T10","T11","T12","T1","T2","T3","T4","T5"];
  return {
    month: months[i],
    planned: 30 + i * 5.5,
    actual: 28 + i * 5.2 + (Math.random() * 4 - 2),
    velocity: 60 + Math.sin(i / 2) * 12 + Math.random() * 8,
  };
});

export const departmentLoad = [
  { name: "Công ty chứng khoán", value: 38, color: "hsl(217 91% 55%)" },
  { name: "Ngân hàng", value: 22, color: "hsl(152 60% 38%)" },
  { name: "Nhà nước", value: 18, color: "hsl(38 92% 50%)" },
  { name: "R&D", value: 12, color: "hsl(14 80% 52%)" },
  { name: "Khác: OS, CTV, TTS", value: 10, color: "hsl(280 60% 55%)" },
];

export const departmentAllocation = [
  { name: "Công ty CK", planned: 40, actual: 38 },
  { name: "Ngân hàng", planned: 25, actual: 22 },
  { name: "Nhà nước", planned: 15, actual: 18 },
  { name: "R&D", planned: 10, actual: 12 },
  { name: "Khác", planned: 10, actual: 10 },
];

export const departmentAllocationHistory: Record<string, typeof departmentAllocation> = {};

const currentHistoryDate = new Date("2026-05-06");
const historyMonths: string[] = [];
for (let y = 2024; y <= 2026; y++) {
  for (let m = 1; m <= 12; m++) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    historyMonths.push(key);
    if (y === currentHistoryDate.getFullYear() && m > currentHistoryDate.getMonth() + 1) break;
  }
}

historyMonths.forEach((key, idx) => {
  const basePlanned = [40, 25, 15, 10, 10];
  const baseActual = [38, 22, 18, 12, 10];
  const drift = Math.sin(idx / 2) * 4;
  departmentAllocationHistory[key] = basePlanned.map((planned, i) => ({
    name: departmentAllocation[i].name,
    planned: Math.max(5, Math.min(95, Math.round(planned + drift * (i % 2 === 0 ? 1 : -1)))),
    actual: Math.max(5, Math.min(95, Math.round(baseActual[i] + drift * (i % 2 === 0 ? -1 : 1)))),
  }));
});

export const allMembers = teamPool;

export const statusMeta: Record<ProjectStatus, { label: string; color: string; dot: string }> = {
  active:   { label: "Đang chạy",  color: "bg-info/10 text-info border-info/20",                    dot: "bg-info" },
  planning: { label: "Khởi tạo",   color: "bg-muted text-muted-foreground border-border",          dot: "bg-muted-foreground" },
  done:     { label: "Hoàn thành", color: "bg-success/10 text-success border-success/20",          dot: "bg-success" },
  onhold:   { label: "Tạm dừng",   color: "bg-warning/10 text-warning-foreground border-warning/30", dot: "bg-warning" },
  overdue:  { label: "Quá hạn",    color: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive" },
};

export const priorityMeta: Record<Priority, { label: string; color: string }> = {
  low:      { label: "Thấp",     color: "text-muted-foreground" },
  medium:   { label: "Trung bình", color: "text-info" },
  high:     { label: "Cao",      color: "text-warning-foreground" },
  critical: { label: "Khẩn",     color: "text-destructive" },
};

export const formatVND = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} tỷ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  return n.toLocaleString("vi-VN");
};
