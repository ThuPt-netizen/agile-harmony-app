import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Upload, Download, FileCheck2, X, CheckCircle2, AlertCircle, FileSpreadsheet, Calendar, User } from "lucide-react";

export type ImportVariant = "resource-plan" | "actual-plan" | "finance";

interface Props {
  variant: ImportVariant;
}

const variantMeta: Record<ImportVariant, { title: string; templateName: string; unit: string }> = {
  "resource-plan": { title: "Import nguồn lực - kế hoạch", templateName: "Template_NguonLuc_KeHoach.xlsx", unit: "FTE" },
  "actual-plan": { title: "Import thực tế - kế hoạch", templateName: "Template_ThucTe_KeHoach.xlsx", unit: "Ngày công" },
  "finance": { title: "Import nguồn lực tài chính", templateName: "Template_NguonLuc_TaiChinh.xlsx", unit: "Triệu VND" },
};

// Project groups → columns
const groups = [
  { name: "HNX", color: "bg-amber-200 text-amber-900", projects: [
    { code: "HNX.Maintain-All", phase: "Bảo trì" },
    { code: "HNX.CBIS", phase: "Bảo trì" },
    { code: "HNX.TP-PHRI", phase: "Triển khai", highlight: true },
    { code: "HNX.Carbon.2025", phase: "Làm trước" },
  ]},
  { name: "VNX", color: "bg-sky-200 text-sky-900", projects: [
    { code: "VNX.2026", phase: "Bảo trì" },
    { code: "HOSE.Đấu giá.Maintain", phase: "Bảo trì" },
  ]},
  { name: "HSX", color: "bg-orange-200 text-orange-900", projects: [
    { code: "VSD.Maintain-All", phase: "DANCPT" },
  ]},
  { name: "VSD", color: "bg-cyan-200 text-cyan-900", projects: [
    { code: "Nghiên cứu, phát triển", phase: "Làm trước" },
    { code: "Core Gen 5", phase: "Triển khai" },
    { code: "HDB.CD.2025", phase: "Bảo hành" },
  ]},
  { name: "Hdbank", color: "bg-teal-200 text-teal-900", projects: [
    { code: "HDB.DSB.2024", phase: "Bảo trì" },
    { code: "TVSI.TPRL.2024", phase: "Bảo trì" },
    { code: "ETIN", phase: "Bảo trì" },
  ]},
];

const allCols = groups.flatMap(g => g.projects);

const peopleNames = [
  "Nguyễn Thị Thủy An","Vũ Thị Hoàng Anh","Lê Việt Bắc","Nguyễn Đức Bác","Trần Tiểu Bang","Nguyễn Kim Chi",
  "Tống Quang Đăng","Phạm Văn Đông","Nguyễn Quang Dũng","Nguyễn Tiến Duy","Bùi Hồng Giang","Nguyễn Năng Hải",
  "Lưu Thị Hằng","Vương Thị Hồng Hạnh","Đặng Thanh Hiếu","Vũ Quang Hiếu","Bùi Thị Hoa","Trịnh Thị Thanh Hoa",
  "Đặng Quang Học","Đoàn Văn Hoàn","Tống Huy Hoàng","Dương Đức Huy",
];
const usernames = ["AnNTT","anhvth","Baclv","bacnd","BangTT","ChiNK","dangtq","Dongpv","Dungnq","Duynt","Giangbh","hainn","HangLT","hanhvh","HieuDT","Hieuvq","Hoabt","HoaTTT","hocdq","Hoandv","Hoangth","huvdd"];

function seedRow(idx: number): number[] {
  const vals: number[] = allCols.map((_, ci) => {
    const r = Math.sin(idx * 13.7 + ci * 5.3) * 10000;
    const v = Math.abs(r) % 1;
    return v > 0.78 ? Number((Math.round(v * 100) / 100).toFixed(2)) : 0 as number;
  });
  if (vals.every(v => v === 0)) (vals as number[])[idx % vals.length] = 1;
  return vals;
}

const seedData = peopleNames.map((name, i) => ({
  stt: i + 7,
  name,
  username: usernames[i],
  values: seedRow(i),
}));

export function ImportData({ variant }: Props) {
  const meta = variantMeta[variant];
  const [date, setDate] = useState("");
  const [importer, setImporter] = useState("");
  const [searched, setSearched] = useState(true);
  const [openImport, setOpenImport] = useState(false);

  const totals = useMemo(() => allCols.map((_, ci) =>
    seedData.reduce((s, r) => s + r.values[ci], 0)
  ), []);

  return (
    <div className="px-6 lg:px-10 py-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{meta.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý dữ liệu import theo từng dự án &amp; nhân sự — đơn vị: {meta.unit}</p>
        </div>
      </motion.div>

      {/* Search toolbar */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
        <div className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Ngày import</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Người import</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={importer} onChange={e => setImporter(e.target.value)} placeholder="Nhập tên người import" className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
          <button onClick={() => setSearched(true)} className="h-10 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 shadow-sm shadow-orange-500/30 flex items-center gap-2">
            <Search className="h-4 w-4" /> Tìm kiếm
          </button>
          <button onClick={() => setOpenImport(true)} className="h-10 px-4 rounded-lg text-sm font-medium text-white bg-[#1F2937] hover:bg-black flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import files
          </button>
        </div>
      </div>

      {/* Data grid */}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Danh sách phân bổ nguồn lực theo dự án</div>
            <div className="text-xs text-gray-500 mt-0.5">Tổng {seedData.length} nhân sự · {allCols.length} dự án</div>
          </div>
          <div className="text-xs text-gray-500">Tháng 4 năm 2026</div>
        </div>
        {searched ? (
          <div className="overflow-auto max-h-[560px]">
            <table className="min-w-full text-xs border-separate border-spacing-0">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="bg-gray-50 border-b border-r border-gray-200 px-2 py-2 sticky left-0 z-30" rowSpan={3}>STT</th>
                  <th className="bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left sticky left-[44px] z-30" rowSpan={3}>Tên nhân sự</th>
                  <th className="bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left sticky left-[224px] z-30" rowSpan={3}>Username</th>
                  {groups.map(g => (
                    <th key={g.name} colSpan={g.projects.length} className={`border-b border-r border-gray-200 px-2 py-1.5 font-semibold ${g.color}`}>{g.name}</th>
                  ))}
                  <th className="bg-gray-100 border-b border-gray-200 px-2 py-1.5 sticky right-0 z-30" rowSpan={3}>Tổng</th>
                </tr>
                <tr>
                  {allCols.map((c, i) => (
                    <th key={i} className={`bg-white border-b border-r border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-700 min-w-[110px] ${c.highlight ? "bg-red-500 text-white" : ""}`}>{c.code}</th>
                  ))}
                </tr>
                <tr>
                  {allCols.map((c, i) => (
                    <th key={i} className={`bg-gray-50 border-b border-r border-gray-200 px-2 py-1 text-[10px] font-normal text-gray-500 ${c.phase === "Bảo hành" ? "bg-pink-100 text-pink-800" : ""}`}>{c.phase}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seedData.map((r, ri) => {
                  const sum = r.values.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={r.username} className="hover:bg-orange-50/40">
                      <td className="bg-white border-b border-r border-gray-100 px-2 py-1.5 text-center sticky left-0 z-10">{r.stt}</td>
                      <td className="bg-white border-b border-r border-gray-100 px-3 py-1.5 sticky left-[44px] z-10 whitespace-nowrap">{r.name}</td>
                      <td className="bg-white border-b border-r border-gray-100 px-3 py-1.5 sticky left-[224px] z-10 text-gray-600">{r.username}</td>
                      {r.values.map((v, ci) => (
                        <td key={ci} className={`border-b border-r border-gray-100 px-2 py-1.5 text-right tabular-nums ${v ? "text-gray-900" : "text-gray-300"}`}>
                          {v ? v.toFixed(v < 1 ? 4 : 3) : "-"}
                        </td>
                      ))}
                      <td className="bg-gray-50 border-b border-gray-100 px-2 py-1.5 text-right font-semibold sticky right-0 z-10 tabular-nums">{sum.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="font-semibold">
                  <td colSpan={3} className="bg-gray-100 border-t border-gray-200 px-3 py-2 text-right sticky left-0 z-10">Tổng</td>
                  {totals.map((t, i) => (
                    <td key={i} className="bg-gray-100 border-t border-r border-gray-200 px-2 py-2 text-right tabular-nums">{t.toFixed(2)}</td>
                  ))}
                  <td className="bg-orange-100 border-t border-gray-200 px-2 py-2 text-right sticky right-0 z-10 tabular-nums">{totals.reduce((a, b) => a + b, 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-gray-500">Bấm "Tìm kiếm" để hiển thị dữ liệu</div>
        )}
      </div>

      {openImport && <ImportPopup meta={meta} onClose={() => setOpenImport(false)} />}
    </div>
  );
}

function ImportPopup({ meta, onClose }: { meta: { title: string; templateName: string; unit: string }; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [checked, setChecked] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "valid" | "invalid">("all");
  const [importFilter, setImportFilter] = useState<"all" | "imported" | "notImported">("all");

  // Generate check result rows
  const rows = useMemo(() => seedData.map((r, i) => ({
    ...r,
    valid: i % 7 !== 3,
    imported: i % 5 === 0,
  })), []);

  const filtered = rows.filter(r => {
    if (statusFilter === "valid" && !r.valid) return false;
    if (statusFilter === "invalid" && r.valid) return false;
    if (importFilter === "imported" && !r.imported) return false;
    if (importFilter === "notImported" && r.imported) return false;
    return true;
  });

  const totalFile = rows.length;
  const totalValid = rows.filter(r => r.valid).length;
  const totalInvalid = totalFile - totalValid;
  const totalImported = rows.filter(r => r.imported).length;
  const totalNotImported = totalFile - totalImported;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[1200px] max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <FileSpreadsheet className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <div className="text-base font-semibold text-gray-900">Import dữ liệu</div>
              <div className="text-xs text-gray-500">{meta.title}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/70 text-gray-500"><X className="h-4 w-4" /></button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-auto">
          {/* File upload row */}
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tải tệp lên</label>
              <div className="flex items-center gap-2">
                <label className="flex-1 h-10 px-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm text-gray-600">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{file ? file.name : "Chọn tệp .xlsx hoặc .csv ..."}</span>
                  <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>
            <button onClick={() => setChecked(true)} disabled={!file}
              className="h-10 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              <FileCheck2 className="h-4 w-4" /> Kiểm tra
            </button>
            <button className="h-10 px-4 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Download className="h-4 w-4" /> Tải mẫu
            </button>
          </div>

          {/* Check result section */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="text-sm font-semibold text-gray-900 mb-3">Kết quả kiểm tra</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Trạng thái</div>
                  <div className="flex gap-1 bg-white rounded-lg p-0.5 border border-gray-200 w-fit">
                    {([["all","Tất cả"],["valid","Hợp lệ"],["invalid","Không hợp lệ"]] as const).map(([k, l]) => (
                      <button key={k} onClick={() => setStatusFilter(k)} className={`px-3 py-1.5 text-xs rounded-md ${statusFilter === k ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Trạng thái Import</div>
                  <div className="flex gap-1 bg-white rounded-lg p-0.5 border border-gray-200 w-fit">
                    {([["all","Tất cả"],["imported","Đã import"],["notImported","Chưa import"]] as const).map(([k, l]) => (
                      <button key={k} onClick={() => setImportFilter(k)} className={`px-3 py-1.5 text-xs rounded-md ${importFilter === k ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {checked ? (
              <>
                <div className="overflow-auto max-h-[360px]">
                  <table className="min-w-full text-xs border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                      <tr>
                        <th className="bg-gray-50 border-b border-r border-gray-200 px-2 py-2 sticky left-0 z-30" rowSpan={3}>STT</th>
                        <th className="bg-gray-50 border-b border-r border-gray-200 px-3 py-2 sticky left-[44px] z-30" rowSpan={3}>Trạng thái</th>
                        <th className="bg-gray-50 border-b border-r border-gray-200 px-3 py-2 sticky left-[156px] z-30" rowSpan={3}>Trạng thái import</th>
                        <th className="bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left" rowSpan={3}>Tên nhân sự</th>
                        <th className="bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left" rowSpan={3}>Username</th>
                        {groups.map(g => (
                          <th key={g.name} colSpan={g.projects.length} className={`border-b border-r border-gray-200 px-2 py-1.5 font-semibold ${g.color}`}>{g.name}</th>
                        ))}
                      </tr>
                      <tr>
                        {allCols.map((c, i) => (
                          <th key={i} className={`bg-white border-b border-r border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-700 min-w-[110px] ${c.highlight ? "bg-red-500 text-white" : ""}`}>{c.code}</th>
                        ))}
                      </tr>
                      <tr>
                        {allCols.map((c, i) => (
                          <th key={i} className={`bg-gray-50 border-b border-r border-gray-200 px-2 py-1 text-[10px] font-normal text-gray-500 ${c.phase === "Bảo hành" ? "bg-pink-100 text-pink-800" : ""}`}>{c.phase}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, i) => (
                        <tr key={r.username} className="hover:bg-orange-50/40">
                          <td className="bg-white border-b border-r border-gray-100 px-2 py-1.5 text-center sticky left-0 z-10">{i + 1}</td>
                          <td className="bg-white border-b border-r border-gray-100 px-3 py-1.5 sticky left-[44px] z-10">
                            {r.valid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Hợp lệ</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-700"><AlertCircle className="h-3 w-3" /> Không hợp lệ</span>
                            )}
                          </td>
                          <td className="bg-white border-b border-r border-gray-100 px-3 py-1.5 sticky left-[156px] z-10">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${r.imported ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"}`}>
                              {r.imported ? "Đã import" : "Chưa import"}
                            </span>
                          </td>
                          <td className="bg-white border-b border-r border-gray-100 px-3 py-1.5 whitespace-nowrap">{r.name}</td>
                          <td className="bg-white border-b border-r border-gray-100 px-3 py-1.5 text-gray-600">{r.username}</td>
                          {r.values.map((v, ci) => (
                            <td key={ci} className={`border-b border-r border-gray-100 px-2 py-1.5 text-right tabular-nums ${v ? "text-gray-900" : "text-gray-300"}`}>
                              {v ? v.toFixed(v < 1 ? 4 : 3) : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <SummaryStat label="Tổng bản ghi file" value={totalFile} tone="default" />
                  <SummaryStat label="Bản ghi hợp lệ" value={totalValid} tone="success" />
                  <SummaryStat label="Bản ghi không hợp lệ" value={totalInvalid} tone="danger" />
                  <SummaryStat label="Đã import" value={totalImported} tone="info" />
                  <SummaryStat label="Chưa import" value={totalNotImported} tone="muted" />
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-gray-500">Chọn tệp và bấm "Kiểm tra" để xem kết quả</div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
          <button onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50">Đóng</button>
          <button disabled={!checked} className="h-10 px-5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            <Upload className="h-4 w-4" /> Import
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: number; tone: "default" | "success" | "danger" | "info" | "muted" }) {
  const tones: Record<string, string> = {
    default: "text-gray-900",
    success: "text-emerald-600",
    danger: "text-rose-600",
    info: "text-sky-600",
    muted: "text-gray-500",
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-lg font-semibold tabular-nums ${tones[tone]}`}>{value}</div>
    </div>
  );
}