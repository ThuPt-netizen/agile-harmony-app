import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Upload, Sigma, Search, X, ChevronsLeft, ChevronsRight, Paperclip } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DayStatus = "normal" | "violation" | "leave-paid" | "leave-unpaid" | "empty";

interface DayLog {
  status: DayStatus;
  checkIn?: string;
  checkOut?: string;
}

interface Person {
  id: string;
  name: string;
  position: string;
  avatar: string;
  daysApproved: number; // x trong x/12
  fine: number;
  logs: Record<number, DayLog>; // dayNumber -> log
}

const avatars = [
  "https://i.pravatar.cc/80?img=47","https://i.pravatar.cc/80?img=5","https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=32","https://i.pravatar.cc/80?img=23","https://i.pravatar.cc/80?img=15",
  "https://i.pravatar.cc/80?img=11","https://i.pravatar.cc/80?img=9","https://i.pravatar.cc/80?img=20",
  "https://i.pravatar.cc/80?img=25","https://i.pravatar.cc/80?img=33","https://i.pravatar.cc/80?img=36",
];

const makeLogs = (entries: Array<[number, DayStatus, string?, string?]>): Record<number, DayLog> => {
  const out: Record<number, DayLog> = {};
  entries.forEach(([d, s, ci, co]) => { out[d] = { status: s, checkIn: ci, checkOut: co }; });
  return out;
};

const seedPeople: Person[] = [
  { id: "1", name: "Đỗ Thị Thùy Linh", position: "Tester", avatar: avatars[0], daysApproved: 4.5, fine: 0, logs: {} },
  { id: "2", name: "Đỗ Khánh Linh", position: "TTS", avatar: avatars[1], daysApproved: 2.5, fine: 0, logs: {} },
  { id: "3", name: "Đỗ Hoàng Trung", position: "Coder", avatar: avatars[2], daysApproved: 3, fine: 0, logs: makeLogs([
    [1, "normal", "08:14", "17:35"], [2, "normal", "08:08", "17:30"],
    [3, "normal", "07:41", "17:30"], [4, "normal", "09:26", "17:30"],
    [5, "violation", "08:07", "17:30"],
  ]) },
  { id: "4", name: "Đặng Thị Ngọc", position: "Kinh doanh", avatar: avatars[3], daysApproved: 1, fine: 0, logs: {} },
  { id: "5", name: "Đặng Thị Hương", position: "Quản trị dự án", avatar: avatars[4], daysApproved: 0, fine: 0, logs: {} },
  { id: "6", name: "Đặng Thanh Hiếu", position: "Coder", avatar: avatars[5], daysApproved: 3.5, fine: 0, logs: makeLogs([
    [2, "leave-paid"], [3, "normal", "08:20", "17:35"],
  ]) },
  { id: "7", name: "Đoàn Văn Hoan", position: "Coder", avatar: avatars[6], daysApproved: 0.5, fine: 0, logs: {} },
  { id: "8", name: "Vương Thị Hồng Hạnh", position: "Trưởng phòng", avatar: avatars[7], daysApproved: 0, fine: 0, logs: makeLogs([
    [4, "leave-unpaid"],
  ]) },
  { id: "9", name: "Vũ Thị Hoàng Anh", position: "Quản trị dự án", avatar: avatars[8], daysApproved: 0, fine: 0, logs: {} },
  { id: "10", name: "Vũ Quang Hiếu", position: "Coder", avatar: avatars[9], daysApproved: 0.5, fine: 0, logs: {} },
  { id: "11", name: "Trần Minh Quang", position: "Tester", avatar: avatars[10], daysApproved: 2, fine: 0, logs: {} },
  { id: "12", name: "Lê Hoàng Long", position: "Coder", avatar: avatars[11], daysApproved: 1.5, fine: 0, logs: {} },
];

const VI_WEEKDAYS = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function daysInMonth(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

const statusColor: Record<DayStatus, string> = {
  normal: "bg-white",
  violation: "bg-amber-100",
  "leave-paid": "bg-sky-100",
  "leave-unpaid": "bg-rose-100",
  empty: "bg-white",
};

export function HrAttendance() {
  const [year, setYear] = useState(2026);
  const [month0, setMonth0] = useState(5); // June (0-based)
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const totalDays = daysInMonth(year, month0);
  const days = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const d = i + 1;
      const dow = new Date(year, month0, d).getDay();
      return { day: d, weekday: VI_WEEKDAYS[dow], isWeekend: dow === 0 || dow === 6 };
    });
  }, [year, month0, totalDays]);

  const monthLabel = `Chấm công tháng ${month0 + 1}/${year}`;
  const rangeLabel = `1/${month0 + 1} - ${totalDays}/${month0 + 1}/${year}`;

  const filtered = seedPeople.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.position.toLowerCase().includes(query.toLowerCase())
  );

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month0 + delta, 1);
    setYear(d.getFullYear()); setMonth0(d.getMonth());
  };

  return (
    <div className="px-6 lg:px-10 py-6 space-y-5 bg-slate-200 min-h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Danh sách chấm công tổng hợp</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button onClick={() => shiftMonth(-1)} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center min-w-[220px]">
              <div className="text-sm font-semibold text-slate-800">{monthLabel}</div>
              <div className="text-[11px] text-slate-500">{rangeLabel}</div>
            </div>
            <button onClick={() => shiftMonth(1)} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <ToolBtn icon={<Upload className="h-4 w-4 text-emerald-600" />} label="Nhập dữ liệu" onClick={() => setImportOpen(true)} />
            <ToolBtn icon={<Download className="h-4 w-4 text-blue-600" />} label="Kết xuất" />
            <ToolBtn icon={<Sigma className="h-4 w-4 text-blue-600" />} label="Tổng hợp" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[calc(100vh-260px)] overflow-y-auto">
          <table className="text-[12px] border-separate border-spacing-0 min-w-max">
            <thead className="sticky top-0 z-30 bg-white">
              <tr>
                <th className="sticky left-0 z-40 bg-white border-b border-r border-slate-200 px-3 py-2 text-left w-[260px] min-w-[260px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Tìm nhanh"
                      className="h-8 pl-7 text-[12px]"
                    />
                  </div>
                </th>
                <th className="sticky left-[260px] z-40 bg-white border-b border-r border-slate-200 w-[140px] min-w-[140px]" />
                {days.map(d => (
                  <th key={d.day} className={cn("border-b border-r border-slate-200 px-2 py-2 text-center font-medium text-slate-600 w-[64px] min-w-[64px]", d.isWeekend && "bg-slate-50")}>
                    <div className="text-[11px]">{d.weekday}</div>
                    <div className="text-[11px] text-slate-500">{d.day}/{month0 + 1}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id} className="group">
                  <td className={cn("sticky left-0 z-20 border-b border-r border-slate-200 px-3 py-2 align-middle", idx % 2 === 0 ? "bg-white" : "bg-slate-50/50", "group-hover:bg-blue-50/50")}>
                    <div className="flex items-center gap-2.5">
                      <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-blue-600 font-medium text-[13px] truncate cursor-pointer hover:underline">{p.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{p.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className={cn("sticky left-[260px] z-20 border-b border-r border-slate-200 px-3 py-2 align-middle whitespace-nowrap", idx % 2 === 0 ? "bg-white" : "bg-slate-50/50", "group-hover:bg-blue-50/50")}>
                    <div className="text-[11px] text-slate-500">Đã NP: <span className="text-slate-800 font-semibold">{p.daysApproved}/12</span></div>
                    <div className="text-[11px] text-slate-500">Tiền phạt: <span className="text-slate-800 font-semibold">{p.fine} đ</span></div>
                  </td>
                  {days.map(d => {
                    const log = p.logs[d.day];
                    const status: DayStatus = log?.status ?? "empty";
                    return (
                      <td key={d.day} className={cn("border-b border-r border-slate-200 px-1 py-1.5 text-center align-middle", statusColor[status], d.isWeekend && status === "empty" && "bg-slate-50")}>
                        {log?.checkIn ? (
                          <div className="leading-tight">
                            <div className="text-[11px] text-slate-700 font-medium">{log.checkIn}</div>
                            <div className="text-[11px] text-slate-500">{log.checkOut}</div>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={2 + days.length} className="text-center py-10 text-slate-500">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 px-5 py-3 border-t border-slate-200 justify-end">
          <LegendItem color="bg-white border border-slate-300" label="Bình thường" />
          <LegendItem color="bg-amber-100" label="Vi phạm" />
          <LegendItem color="bg-sky-100" label="Nghỉ có phép" />
          <LegendItem color="bg-rose-100" label="Nghỉ không phép" />
        </div>
      </div>

      <ImportAttendanceDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}

function ToolBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1.5"
    >
      {icon}{label}
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[12px] text-slate-600">
      <span className={cn("h-3.5 w-6 rounded-sm", color)} />
      {label}
    </div>
  );
}

function ImportAttendanceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [fileName, setFileName] = useState<string>("");
  const [overwrite, setOverwrite] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-5xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b bg-sky-50/60">
          <DialogTitle className="text-base font-semibold text-slate-800">Nhập file chấm công</DialogTitle>
          <DialogClose className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></DialogClose>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[12px] text-slate-600">File đính kèm:</label>
            <div className="mt-1.5 h-10 rounded-md border border-slate-200 bg-slate-50/60 flex items-center justify-between px-3">
              <span className="text-[13px] text-slate-600 truncate">{fileName || <span className="text-slate-400">Chưa có tệp nào</span>}</span>
              <label className="cursor-pointer inline-flex items-center gap-1.5 h-7 px-3 rounded-md border border-slate-300 text-[12px] text-slate-700 hover:bg-white">
                <Paperclip className="h-3.5 w-3.5" /> Chọn tệp
                <input type="file" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name ?? "")} />
              </label>
            </div>
          </div>

          <div>
            <div className="text-[12px] text-slate-600 mb-1.5">Cho phép ghi đè dữ liệu cũ:</div>
            <label className="inline-flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
              <Checkbox checked={overwrite} onCheckedChange={(v) => setOverwrite(!!v)} />
              Ghi đè dữ liệu
            </label>
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="px-3 py-2 font-medium w-12">STT</th>
                  <th className="px-3 py-2 font-medium">Họ và tên</th>
                  <th className="px-3 py-2 font-medium">Khu vực</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Ngày</th>
                  <th className="px-3 py-2 font-medium">Thứ</th>
                  <th className="px-3 py-2 font-medium">Check in</th>
                  <th className="px-3 py-2 font-medium">Check out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    {fileName ? "Chưa có dữ liệu" : "Đang tải..."}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[12px] text-slate-600">
            <div className="inline-flex items-center gap-2">
              Hiển thị
              <Select defaultValue="100">
                <SelectTrigger className="h-7 w-[72px] text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["50","100","200"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
              /0 bản ghi
            </div>
            <div className="flex items-center gap-1">
              <PageBtn><ChevronsLeft className="h-4 w-4" /></PageBtn>
              <PageBtn><ChevronLeft className="h-4 w-4" /></PageBtn>
              <PageBtn><ChevronRight className="h-4 w-4" /></PageBtn>
              <PageBtn><ChevronsRight className="h-4 w-4" /></PageBtn>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t flex justify-end gap-2 bg-slate-50/60">
          <button className="h-9 px-4 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-white">Xác nhận</button>
          <button onClick={() => onOpenChange(false)} className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-sm text-white">Đóng</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PageBtn({ children }: { children: React.ReactNode }) {
  return <button className="h-7 w-7 inline-flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">{children}</button>;
}