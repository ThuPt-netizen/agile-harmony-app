import { useState } from "react";
import { Search, Calendar, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Row {
  code: string;
  khCoin: number;
  khPoint: number;
  khMM: number;
  ttCoin: number;
  ttPoint: number;
  ttMM: number;
}

const PROJECTS = ["PRJ-001", "PRJ-002", "PRJ-003", "PRJ-004", "PRJ-005"];

const SEED: Row[] = [
  { code: "PRJ-001", khCoin: 1200, khPoint: 850, khMM: 12, ttCoin: 1150, ttPoint: 820, ttMM: 11.5 },
  { code: "PRJ-002", khCoin: 980,  khPoint: 700, khMM: 10, ttCoin: 1020, ttPoint: 730, ttMM: 10.2 },
  { code: "PRJ-003", khCoin: 1500, khPoint: 1100, khMM: 15, ttCoin: 1380, ttPoint: 980, ttMM: 14.1 },
  { code: "PRJ-004", khCoin: 600,  khPoint: 420, khMM: 6,  ttCoin: 580,  ttPoint: 410, ttMM: 5.8 },
];

export function HrMeiMonthly() {
  const [project, setProject] = useState<string>("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [rows, setRows] = useState<Row[]>(SEED);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = () => {
    let r = SEED;
    if (project) r = r.filter((x) => x.code === project);
    setRows(r);
  };

  const fmt = (n: number) => n.toLocaleString("vi-VN");

  return (
    <div className="bg-slate-100 m-3 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 px-1">Danh sách mei theo tháng của các dự án</h2>

      {/* Filter card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-orange-600 mb-1.5">Mã dự án</label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger className="h-10 bg-white">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent>
                {PROJECTS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-emerald-600 mb-1.5">Tháng</label>
            <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-slate-300 bg-white">
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                placeholder="Start month"
                className="flex-1 text-sm bg-transparent outline-none text-slate-700"
              />
              <span className="text-slate-400">→</span>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                placeholder="End month"
                className="flex-1 text-sm bg-transparent outline-none text-slate-700"
              />
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="h-10 px-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Search className="h-4 w-4" /> Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sky-50 text-slate-700">
                <th className="text-left px-4 py-3 font-semibold border-r border-sky-100">Mã dự án</th>
                <th className="text-right px-4 py-3 font-semibold border-r border-sky-100">KH-Tổng coin</th>
                <th className="text-right px-4 py-3 font-semibold border-r border-sky-100">KH-Tổng point</th>
                <th className="text-right px-4 py-3 font-semibold border-r border-sky-100">KH-Tổng MM</th>
                <th className="text-right px-4 py-3 font-semibold border-r border-sky-100">TT-Tổng coin</th>
                <th className="text-right px-4 py-3 font-semibold border-r border-sky-100">TT-Tổng point</th>
                <th className="text-right px-4 py-3 font-semibold">TT-Tổng MM</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-slate-400 py-16 text-sm">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                rows.slice(0, pageSize).map((r, i) => (
                  <tr key={r.code} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{r.code}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">{fmt(r.khCoin)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">{fmt(r.khPoint)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">{r.khMM}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-700">{fmt(r.ttCoin)}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-700">{fmt(r.ttPoint)}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-700">{r.ttMM}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-7 px-2 rounded border border-slate-300 bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>/ {rows.length} bản ghi</span>
            <button className="ml-2 text-blue-600 hover:text-blue-700" title="Tải xuống">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-200"><ChevronsLeft className="h-4 w-4" /></button>
            <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-200"><ChevronLeft className="h-4 w-4" /></button>
            <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-200"><ChevronRight className="h-4 w-4" /></button>
            <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-200"><ChevronsRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}