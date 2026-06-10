import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  Calendar as CalendarIcon,
  ClipboardEdit,
  ClipboardCheck,
  CalendarRange,
  UsersRound,
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  code: string;
  customer: string;
  pm: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  status: string;
  manager: string;
  pointPlan: number;
  meiPlan: number;
  mmPlan: number;
  coinPlan: number;
  pointActual: number;
  meiActual: number;
  mmActual: number;
  coinActual: number;
}

const seed: Project[] = [
  { id: "P001", name: "JBSV.MAIN", code: "JBSV.MAIN", customer: "", pm: "", startDate: "", endDate: "", memberCount: 0, status: "Đang bảo trì", manager: "", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P002", name: "NVS. Nghiên cứu, phát triển", code: "NVS.RD", customer: "", pm: "", startDate: "", endDate: "", memberCount: 0, status: "Đang bảo trì", manager: "", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P003", name: "IRS_MAINTAIN", code: "IRS_MAINTAIN", customer: "", pm: "", startDate: "", endDate: "", memberCount: 0, status: "Đang bảo trì", manager: "", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P004", name: "MSB. Maintain", code: "MSB.Maintain", customer: "MSB", pm: "Trần Duy Hưng", startDate: "01/03/2025", endDate: "31/12/2026", memberCount: 0, status: "Đang triển khai", manager: "Trần Duy Hưng", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P005", name: "KRXVSD", code: "KRXVSD", customer: "KRX", pm: "Đỗ Duy Sáng", startDate: "", endDate: "", memberCount: 0, status: "Đang triển khai", manager: "Đỗ Duy Sáng", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P006", name: "KRX-CTCK", code: "KRX-CTCK", customer: "KRX", pm: "Đỗ Duy Sáng", startDate: "", endDate: "", memberCount: 0, status: "Đang triển khai", manager: "Đỗ Duy Sáng", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P007", name: "ShareHolder", code: "ShareHolder", customer: "", pm: "", startDate: "", endDate: "", memberCount: 0, status: "Đang triển khai", manager: "", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P008", name: "Monitor-TPRL-VCBGATE", code: "Monitor-TPRL-VCBGATE", customer: "", pm: "", startDate: "", endDate: "", memberCount: 0, status: "Đang bảo trì", manager: "", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P009", name: "SUPPORT_VIETINCAPITAL", code: "SUPPORT_VIETINCAPITAL", customer: "", pm: "", startDate: "", endDate: "", memberCount: 0, status: "Đang bảo trì", manager: "", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
  { id: "P010", name: "GEMSTOCK", code: "GEMSTOCK", customer: "Gem", pm: "Đỗ Duy Sáng", startDate: "", endDate: "", memberCount: 0, status: "Đang bảo trì", manager: "Đỗ Duy Sáng", pointPlan: 0, meiPlan: 0, mmPlan: 0, coinPlan: 0, pointActual: 0, meiActual: 0, mmActual: 0, coinActual: 0 },
];

const statusOptions = ["Đang triển khai", "Đang bảo trì", "Tạm dừng", "Hoàn thành"];
const customerOptions = ["MSB", "KRX", "Gem", "VCB", "VietinBank"];
const pmOptions = ["Trần Duy Hưng", "Đỗ Duy Sáng", "Bùi Ngọc Anh", "Lê Quốc Bảo", "Vũ Mai Linh"];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    "Đang triển khai": "text-blue-600",
    "Đang bảo trì": "text-amber-600",
    "Tạm dừng": "text-slate-500",
    "Hoàn thành": "text-emerald-600",
  };
  return map[s] || "text-slate-700";
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className={cn("text-xs font-medium", required ? "text-rose-500" : "text-slate-600")}>
        {label}{required && " :"}{!required && " :"}
      </Label>
      {children}
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-sky-600">{label}</div>
      <div className="text-sm font-medium text-slate-800">{value || "—"}</div>
    </div>
  );
}

export function HrProjects() {
  const [rows, setRows] = useState<Project[]>(seed);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMeiPlan, setOpenMeiPlan] = useState(false);
  const [openMeiActual, setOpenMeiActual] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [view, setView] = useState<"list" | "monthly">("list");
  const [monthlyProject, setMonthlyProject] = useState<Project | null>(null);
  const [openAddMonthly, setOpenAddMonthly] = useState(false);
  const [monthlyRows, setMonthlyRows] = useState<any[]>([]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [rows, query, statusFilter, startFilter, endFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selRow = rows.find((r) => selected.has(r.id) && selected.size === 1) || null;
  const hasSel = selected.size > 0;
  const onlyOne = selected.size === 1;

  const toggleAll = (c: boolean) => {
    if (c) setSelected(new Set(paged.map((r) => r.id)));
    else setSelected(new Set());
  };
  const toggleOne = (id: string, c: boolean) => {
    const n = new Set(selected);
    if (c) n.add(id); else n.delete(id);
    setSelected(n);
  };

  if (view === "monthly" && monthlyProject) {
    return (
      <div className="bg-white rounded-[1.5rem] m-3 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView("list")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
            </Button>
            <h2 className="text-lg font-semibold text-slate-800">Chi tiết mei của dự án theo tháng</h2>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-5 mb-5">
          <div className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-4">Thông tin mei toàn dự án</div>
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            <ReadonlyField label="Tên dự án" value={monthlyProject.name} />
            <ReadonlyField label="Mã dự án" value={monthlyProject.code} />
            <div />
            <div />
            <ReadonlyField label="Tổng số point theo kế hoạch" value={monthlyProject.pointPlan} />
            <ReadonlyField label="Tổng số mei theo kế hoạch" value={monthlyProject.meiPlan} />
            <ReadonlyField label="Tổng số MM theo kế hoạch" value={monthlyProject.mmPlan} />
            <ReadonlyField label="Tỷ giá coin mei theo kế hoạch" value={monthlyProject.coinPlan} />
            <ReadonlyField label="Tổng số point thực tế" value={monthlyProject.pointActual} />
            <ReadonlyField label="Tổng số mei thực tế" value={monthlyProject.meiActual} />
            <ReadonlyField label="Tổng số MM thực tế" value={monthlyProject.mmActual} />
            <ReadonlyField label="Tỷ giá coin mei thực tế" value={monthlyProject.coinActual} />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <div className="text-sm font-semibold text-slate-700">Thông tin mei theo tháng</div>
            <Button size="sm" variant="ghost" className="text-sky-600 hover:text-sky-700" onClick={() => setOpenAddMonthly(true)}>
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sky-50 text-slate-700 text-xs">
                <th className="text-left px-3 py-2 font-semibold">Tháng</th>
                <th className="text-left px-3 py-2 font-semibold">Năm</th>
                <th className="text-left px-3 py-2 font-semibold">Coin theo kế hoạch</th>
                <th className="text-left px-3 py-2 font-semibold">Point theo kế hoạch</th>
                <th className="text-left px-3 py-2 font-semibold">MM theo kế hoạch</th>
                <th className="text-left px-3 py-2 font-semibold">Coin thực tế</th>
                <th className="text-left px-3 py-2 font-semibold">Point thực tế</th>
                <th className="text-left px-3 py-2 font-semibold">MM thực tế</th>
                <th className="text-left px-3 py-2 font-semibold">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-slate-400 py-16">
                    <div className="inline-block px-3 py-1 border border-slate-200 rounded text-xs">Không có dữ liệu</div>
                  </td>
                </tr>
              ) : (
                monthlyRows.map((m, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-3 py-2">{m.month}</td>
                    <td className="px-3 py-2">{m.year}</td>
                    <td className="px-3 py-2">{m.coinPlan}</td>
                    <td className="px-3 py-2">{m.pointPlan}</td>
                    <td className="px-3 py-2">{m.mmPlan}</td>
                    <td className="px-3 py-2">{m.coinActual}</td>
                    <td className="px-3 py-2">{m.pointActual}</td>
                    <td className="px-3 py-2">{m.mmActual}</td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AddMonthlyDialog
          open={openAddMonthly}
          onClose={() => setOpenAddMonthly(false)}
          projectName={monthlyProject.name}
          onSave={(r) => { setMonthlyRows([...monthlyRows, r]); setOpenAddMonthly(false); }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[1.5rem] m-3 p-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-1 mb-4 text-sm">
        <ToolBtn icon={Eye} label="Chi tiết" disabled={!onlyOne} onClick={() => setOpenDetail(true)} />
        <ToolBtn icon={Pencil} label="Cập nhật" disabled={!onlyOne} onClick={() => setOpenEdit(true)} />
        <ToolBtn icon={ClipboardEdit} label="Nhập mei kế hoạch" disabled={!onlyOne} onClick={() => setOpenMeiPlan(true)} />
        <ToolBtn icon={ClipboardCheck} label="Nhập mei thực tế" disabled={!onlyOne} onClick={() => setOpenMeiActual(true)} />
        <ToolBtn icon={CalendarRange} label="Mei theo tháng" disabled={!onlyOne} onClick={() => { setMonthlyProject(selRow!); setView("monthly"); }} />
        <ToolBtn icon={UsersRound} label="Gán/gỡ nhân sự" disabled={!onlyOne} onClick={() => setOpenAssign(true)} />
        <ToolBtn icon={Trash2} label="Xóa" disabled={!hasSel} onClick={() => setOpenDelete(true)} danger />
        <ToolBtn icon={Plus} label="Thêm" disabled={hasSel} onClick={() => setOpenAdd(true)} primary />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 border border-slate-200 rounded-xl p-4 mb-4">
        <div>
          <Label className="text-xs text-slate-600">Ngày bắt đầu</Label>
          <div className="relative">
            <Input type="date" value={startFilter} onChange={(e) => setStartFilter(e.target.value)} className="h-9 mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Ngày kết thúc</Label>
          <Input type="date" value={endFilter} onChange={(e) => setEndFilter(e.target.value)} className="h-9 mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Tên</Label>
          <Input placeholder="Tên dự án" value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Trạng thái</Label>
          <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Tất cả" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full h-9 bg-sky-500 hover:bg-sky-600">
            <Search className="h-4 w-4 mr-1" /> Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-auto">
        <table className="w-full text-sm min-w-[1800px]">
          <thead>
            <tr className="bg-slate-50 text-slate-700 text-xs">
              <th className="px-3 py-3 w-10">
                <Checkbox
                  checked={paged.length > 0 && paged.every((r) => selected.has(r.id))}
                  onCheckedChange={(c) => toggleAll(!!c)}
                />
              </th>
              <th className="text-left px-3 py-3 font-semibold">Tên dự án</th>
              <th className="text-left px-3 py-3 font-semibold">Mã dự án</th>
              <th className="text-left px-3 py-3 font-semibold">Đối tượng khách hàng</th>
              <th className="text-left px-3 py-3 font-semibold">Quản trị dự án</th>
              <th className="text-left px-3 py-3 font-semibold">Ngày bắt đầu</th>
              <th className="text-left px-3 py-3 font-semibold">Ngày kết thúc</th>
              <th className="text-left px-3 py-3 font-semibold">Số thành viên</th>
              <th className="text-left px-3 py-3 font-semibold">Trạng thái</th>
              <th className="text-left px-3 py-3 font-semibold">Quản trị dự án</th>
              <th className="text-left px-3 py-3 font-semibold">Số point theo kế hoạch</th>
              <th className="text-left px-3 py-3 font-semibold">Số mei theo kế hoạch</th>
              <th className="text-left px-3 py-3 font-semibold">Số MM theo kế hoạch</th>
              <th className="text-left px-3 py-3 font-semibold">Tỷ giá coin theo kế hoạch</th>
              <th className="text-left px-3 py-3 font-semibold">Số point thực tế</th>
              <th className="text-left px-3 py-3 font-semibold">Số mei theo thực tế</th>
              <th className="text-left px-3 py-3 font-semibold">Số MM theo thực tế</th>
              <th className="text-left px-3 py-3 font-semibold">Tỷ giá coin theo thực tế</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={18} className="text-center py-12 text-slate-400">Không có dữ liệu</td></tr>
            ) : paged.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-3 py-2.5">
                  <Checkbox checked={selected.has(r.id)} onCheckedChange={(c) => toggleOne(r.id, !!c)} />
                </td>
                <td className="px-3 py-2.5 text-slate-700">{r.name}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.code}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.customer}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.pm}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.startDate}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.endDate}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.memberCount}</td>
                <td className={cn("px-3 py-2.5 font-medium", statusBadge(r.status))}>{r.status}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.manager}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.pointPlan}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.meiPlan}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.mmPlan}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.coinPlan}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.pointActual}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.meiActual}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.mmActual}</td>
                <td className="px-3 py-2.5 text-slate-700">{r.coinActual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <span>/{filtered.length} bản ghi</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-sky-600"><Download className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(1)}><ChevronsLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft className="h-4 w-4" /></Button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
            <Button key={i} variant={page === i + 1 ? "default" : "ghost"} size="sm" className={cn("h-8 w-8 p-0", page === i + 1 && "bg-sky-500 hover:bg-sky-600")} onClick={() => setPage(i + 1)}>{i + 1}</Button>
          ))}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(Math.min(totalPages, page + 1))}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(totalPages)}><ChevronsRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Dialogs */}
      <ProjectFormDialog open={openAdd} onClose={() => setOpenAdd(false)} title="Thêm thông tin dự án" />
      <ProjectFormDialog open={openEdit} onClose={() => setOpenEdit(false)} title={`Sửa thông tin dự án - ${selRow?.code || ""}`} initial={selRow || undefined} />
      <DetailDialog open={openDetail} onClose={() => setOpenDetail(false)} project={selRow} />
      <MeiPlanDialog open={openMeiPlan} onClose={() => setOpenMeiPlan(false)} projectName={selRow?.name || ""} />
      <MeiActualDialog open={openMeiActual} onClose={() => setOpenMeiActual(false)} projectName={selRow?.name || ""} />
      <AssignDialog open={openAssign} onClose={() => setOpenAssign(false)} project={selRow} />
      <DeleteDialog open={openDelete} onClose={() => setOpenDelete(false)} project={selRow} count={selected.size} onConfirm={() => {
        setRows(rows.filter((r) => !selected.has(r.id)));
        setSelected(new Set());
        setOpenDelete(false);
      }} />
    </div>
  );
}

function ToolBtn({ icon: Icon, label, disabled, onClick, primary, danger }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
        disabled
          ? "text-slate-300 cursor-not-allowed"
          : primary
            ? "text-emerald-600 hover:bg-emerald-50"
            : danger
              ? "text-rose-500 hover:bg-rose-50"
              : "text-slate-600 hover:bg-slate-100"
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function ProjectFormDialog({ open, onClose, title, initial }: { open: boolean; onClose: () => void; title: string; initial?: Project }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader><DialogTitle className="text-sky-700">{title}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 py-2">
          <Field label="Tên dự án" required><Input defaultValue={initial?.name} className="h-9 bg-slate-50" /></Field>
          <Field label="Mã dự án" required><Input defaultValue={initial?.code} className="h-9 bg-slate-50" /></Field>
          <Field label="Trạng thái">
            <Select defaultValue={initial?.status}>
              <SelectTrigger className="h-9 bg-slate-50"><SelectValue placeholder="Chọn" /></SelectTrigger>
              <SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Đối tượng KH">
            <Select defaultValue={initial?.customer}>
              <SelectTrigger className="h-9 bg-slate-50"><SelectValue placeholder="Chọn" /></SelectTrigger>
              <SelectContent>{customerOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Pm">
            <Select defaultValue={initial?.pm}>
              <SelectTrigger className="h-9 bg-slate-50"><SelectValue placeholder="Chọn" /></SelectTrigger>
              <SelectContent>{pmOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Ngày bắt đầu"><Input type="date" className="h-9 bg-slate-50" /></Field>
          <Field label="Ngày kết thúc"><Input type="date" className="h-9 bg-slate-50" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Xác nhận</Button>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailDialog({ open, onClose, project }: { open: boolean; onClose: () => void; project: Project | null }) {
  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-sky-700">Xem thông tin dự án - {project.code}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 py-2">
          <Field label="Tên dự án"><Input readOnly value={project.name} className="h-9 bg-slate-100" /></Field>
          <Field label="Mã dự án"><Input readOnly value={project.code} className="h-9 bg-slate-100" /></Field>
          <Field label="Trạng thái"><Input readOnly value={project.status} className="h-9 bg-slate-100" /></Field>
          <Field label="Đối tượng KH"><Input readOnly value={project.customer} className="h-9 bg-slate-100" /></Field>
          <Field label="Pm"><Input readOnly value={project.pm} className="h-9 bg-slate-100" /></Field>
          <Field label="Ngày bắt đầu"><Input readOnly value={project.startDate} className="h-9 bg-slate-100" /></Field>
          <Field label="Ngày kết thúc"><Input readOnly value={project.endDate} className="h-9 bg-slate-100" /></Field>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-2">
          <div className="text-sm text-slate-400 mb-3">Kế hoạch:</div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            <Field label="Tổng số point kế hoạch"><Input readOnly value={project.pointPlan} className="h-9 bg-slate-100" /></Field>
            <Field label="Tổng số mei kế hoạch"><Input readOnly value={project.meiPlan} className="h-9 bg-slate-100" /></Field>
            <Field label="Tổng số MM kế hoạch"><Input readOnly value={project.mmPlan} className="h-9 bg-slate-100" /></Field>
            <Field label="Tỷ giá coin mei kế hoạch"><Input readOnly value={project.coinPlan} className="h-9 bg-slate-100" /></Field>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-2">
          <div className="text-sm text-slate-400 mb-3">Thực tế:</div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            <Field label="Tổng số point thực tế"><Input readOnly value={project.pointActual} className="h-9 bg-slate-100" /></Field>
            <Field label="Tổng lũy kế mei thực tế"><Input readOnly value={project.meiActual} className="h-9 bg-slate-100" /></Field>
            <Field label="Tổng số MM thực tế"><Input readOnly value={project.mmActual} className="h-9 bg-slate-100" /></Field>
            <Field label="Tỷ giá coin mei thực tế"><Input readOnly value={project.coinActual} className="h-9 bg-slate-100" /></Field>
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MeiPlanDialog({ open, onClose, projectName }: { open: boolean; onClose: () => void; projectName: string }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader><DialogTitle className="text-sky-700">Cập nhật mei theo kế hoạch - {projectName}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 py-2">
          <Field label="Tổng số point theo kế hoạch" required><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
          <Field label="Tổng số mei theo kế hoạch" required><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
          <Field label="Tổng số MM theo kế hoạch" required><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
          <Field label="Tỷ giá coin mei theo kế hoạch"><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Xác nhận</Button>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MeiActualDialog({ open, onClose, projectName }: { open: boolean; onClose: () => void; projectName: string }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader><DialogTitle className="text-sky-700">Cập nhật mei thực tế - {projectName}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 py-2">
          <Field label="Tổng số point thực tế" required><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
          <Field label="Tổng lũy kế mei hiện tại" required><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
          <Field label="Tổng số MM hiện tại" required><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
          <Field label="Tỷ giá coin mei thực tế"><Input defaultValue="0" className="h-9 bg-slate-50" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Xác nhận</Button>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const peopleSeed = [
  { id: 1, name: "Bùi Hồng Giang", role: "Tester", contract: "Hợp đồng 1 năm" },
  { id: 2, name: "Bùi Thị Hoa", role: "Tester", contract: "Hợp đồng 3 năm" },
  { id: 3, name: "Dương Thị Linh Chi", role: "Tester", contract: "Thử việc" },
  { id: 4, name: "Dương Thị Ly", role: "Tester", contract: "Hợp đồng 1 năm" },
  { id: 5, name: "Dương Đức Huy", role: "Coder", contract: "Hợp đồng 1 năm" },
  { id: 6, name: "Hoàng Thu Hoài", role: "Tester", contract: "Hợp đồng 1 năm" },
];

function AssignDialog({ open, onClose, project }: { open: boolean; onClose: () => void; project: Project | null }) {
  const [left, setLeft] = useState(peopleSeed);
  const [right, setRight] = useState<typeof peopleSeed>([]);
  const [leftSel, setLeftSel] = useState<Set<number>>(new Set());
  const [rightSel, setRightSel] = useState<Set<number>>(new Set());

  const assign = () => {
    const moving = left.filter((p) => leftSel.has(p.id));
    setRight([...right, ...moving]);
    setLeft(left.filter((p) => !leftSel.has(p.id)));
    setLeftSel(new Set());
  };
  const unassign = () => {
    const moving = right.filter((p) => rightSel.has(p.id));
    setLeft([...left, ...moving]);
    setRight(right.filter((p) => !rightSel.has(p.id)));
    setRightSel(new Set());
  };

  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-white">
        <DialogHeader><DialogTitle className="text-sky-700">Gán/gỡ nhân sự của dự án - {project.name}</DialogTitle></DialogHeader>
        <div className="border-b border-slate-200 pb-3 mb-3">
          <div className="text-sm font-semibold text-slate-700 mb-2">Thông tin dự án</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tên dự án"><Input readOnly value={project.name} className="h-9 bg-slate-100" /></Field>
            <Field label="Mã dự án"><Input readOnly value={project.code} className="h-9 bg-slate-100" /></Field>
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-700 mb-2">Danh sách nhân sự</div>
        <div className="grid grid-cols-2 gap-4">
          <PeopleList title="Danh sách nhân sự" rows={left} sel={leftSel} setSel={setLeftSel} action="Gán vào dự án" onAction={assign} />
          <PeopleList title="Danh sách nhân sự thuộc dự án" rows={right} sel={rightSel} setSel={setRightSel} action="Xóa khỏi dự án" onAction={unassign} empty="No data" />
        </div>
        <DialogFooter>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PeopleList({ title, rows, sel, setSel, action, onAction, empty }: any) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">{title}</div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-xs text-slate-600">
              <th className="w-8"></th>
              <th className="text-left px-2 py-2">STT</th>
              <th className="text-left px-2 py-2">Họ và tên</th>
              <th className="text-left px-2 py-2">Chức danh</th>
              <th className="text-left px-2 py-2">Loại hợp đồng</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-slate-400 py-10">{empty || "No data"}</td></tr>
            ) : rows.map((p: any, i: number) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-2 py-1.5">
                  <Checkbox checked={sel.has(p.id)} onCheckedChange={(c) => {
                    const n = new Set(sel); if (c) n.add(p.id); else n.delete(p.id); setSel(n);
                  }} />
                </td>
                <td className="px-2 py-1.5">{i + 1}</td>
                <td className="px-2 py-1.5">{p.name}</td>
                <td className="px-2 py-1.5">{p.role}</td>
                <td className="px-2 py-1.5">{p.contract}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-200 p-2 flex justify-end">
        <Button size="sm" className="bg-sky-500 hover:bg-sky-600" disabled={sel.size === 0} onClick={onAction}>{action}</Button>
      </div>
    </div>
  );
}

function DeleteDialog({ open, onClose, project, count, onConfirm }: { open: boolean; onClose: () => void; project: Project | null; count: number; onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader><DialogTitle className="text-sky-700">Xác nhận xóa</DialogTitle></DialogHeader>
        <div className="py-3 text-sm text-slate-700">
          Bạn có chắc muốn xóa {count} bản ghi {project && <span className="text-rose-500 font-medium">{project.name}</span>}?
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onConfirm}>Xác nhận</Button>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddMonthlyDialog({ open, onClose, projectName, onSave }: { open: boolean; onClose: () => void; projectName: string; onSave: (r: any) => void }) {
  const [form, setForm] = useState({ month: "6", year: "2026", coinPlan: "", pointPlan: "", mmPlan: "", coinActual: "", pointActual: "", mmActual: "" });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader><DialogTitle className="text-sky-700">Thêm mới thông tin mei theo tháng, dự án: {projectName}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 py-2">
          <Field label="Tháng" required><Input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="h-9 bg-slate-50" /></Field>
          <Field label="Năm" required><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="h-9 bg-slate-50" /></Field>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-2">
          <div className="text-sm text-slate-400 mb-3">Kế hoạch:</div>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Tổng số coint kế hoạch"><Input value={form.coinPlan} onChange={(e) => setForm({ ...form, coinPlan: e.target.value })} className="h-9 bg-slate-50" /></Field>
            <Field label="Tổng số point kế hoạch"><Input value={form.pointPlan} onChange={(e) => setForm({ ...form, pointPlan: e.target.value })} className="h-9 bg-slate-50" /></Field>
            <Field label="Tổng số MM kế hoạch"><Input value={form.mmPlan} onChange={(e) => setForm({ ...form, mmPlan: e.target.value })} className="h-9 bg-slate-50" /></Field>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-2">
          <div className="text-sm text-slate-400 mb-3">Thực tế:</div>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Tổng số coin thực tế"><Input value={form.coinActual} onChange={(e) => setForm({ ...form, coinActual: e.target.value })} className="h-9 bg-slate-50" /></Field>
            <Field label="Tổng số point thực tế"><Input value={form.pointActual} onChange={(e) => setForm({ ...form, pointActual: e.target.value })} className="h-9 bg-slate-50" /></Field>
            <Field label="Tổng số MM thực tế"><Input value={form.mmActual} onChange={(e) => setForm({ ...form, mmActual: e.target.value })} className="h-9 bg-slate-50" /></Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onSave(form)}>Xác nhận</Button>
          <Button className="bg-sky-500 hover:bg-sky-600" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}