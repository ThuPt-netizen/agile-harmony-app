import { useState, useMemo } from "react";
import { Search, Plus, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TabKey = "func" | "data";

interface FuncRow {
  id: string;
  loai: string;          // Loại chức năng
  danhMuc: string;       // Danh mục chức năng
  ma: string;            // Mã chức năng
  moTa: string;          // Mô tả
  truyVan: boolean;
  them: boolean;
  sua: boolean;
  xoa: boolean;
}

interface DataRow {
  id: string;
  loai: string;          // Loại chức năng
  danhMuc: string;
  ma: string;            // Mã chức năng
  truong: string;        // Tên trường dữ liệu
  moTa: string;
  truyVan: boolean;
  them: boolean;
  sua: boolean;
  xoa: boolean;
}

const loaiOptions = ["Menu", "Báo cáo", "Tiện ích"];
const danhMucOptions = ["Quản trị hệ thống", "Quản lý dự án", "Báo cáo & thống kê"];
const truongOptions = ["project_id", "user_id", "department_id", "status"];
const groupOptions = [
  { code: "ADMIN", name: "Quản trị viên" },
  { code: "PM", name: "Quản lý dự án" },
  { code: "STAFF", name: "Nhân viên" },
  { code: "GUEST", name: "Khách" },
];

const seedFunc: FuncRow[] = [
  { id: "f1", loai: "Menu",     danhMuc: "Quản trị hệ thống", ma: "SYS_USER",     moTa: "Quản lý người sử dụng",   truyVan: true,  them: true,  sua: true,  xoa: false },
  { id: "f2", loai: "Menu",     danhMuc: "Quản trị hệ thống", ma: "SYS_GROUP",    moTa: "Quản lý nhóm người dùng", truyVan: true,  them: true,  sua: true,  xoa: true  },
  { id: "f3", loai: "Menu",     danhMuc: "Quản trị hệ thống", ma: "SYS_PERM",     moTa: "Quản lý phân quyền",      truyVan: true,  them: false, sua: true,  xoa: false },
  { id: "f4", loai: "Menu",     danhMuc: "Quản lý dự án",     ma: "PRJ_LIST",     moTa: "Danh mục dự án",           truyVan: true,  them: true,  sua: true,  xoa: true  },
  { id: "f5", loai: "Báo cáo",  danhMuc: "Báo cáo & thống kê", ma: "RPT_PERF",    moTa: "Báo cáo hiệu suất",       truyVan: true,  them: false, sua: false, xoa: false },
  { id: "f6", loai: "Tiện ích", danhMuc: "Quản trị hệ thống", ma: "SYS_LOG",      moTa: "Nhật ký hệ thống",         truyVan: true,  them: false, sua: false, xoa: false },
];

const seedData: DataRow[] = [
  { id: "d1", loai: "Menu", danhMuc: "Quản lý dự án",     ma: "PRJ_LIST", truong: "project_id",    moTa: "Mã dự án",       truyVan: true,  them: true,  sua: true,  xoa: false },
  { id: "d2", loai: "Menu", danhMuc: "Quản trị hệ thống", ma: "SYS_USER", truong: "user_id",       moTa: "Mã người dùng",   truyVan: true,  them: true,  sua: false, xoa: false },
  { id: "d3", loai: "Menu", danhMuc: "Quản trị hệ thống", ma: "SYS_USER", truong: "department_id", moTa: "Phòng ban",       truyVan: true,  them: false, sua: true,  xoa: false },
  { id: "d4", loai: "Menu", danhMuc: "Quản lý dự án",     ma: "PRJ_LIST", truong: "status",        moTa: "Trạng thái dự án", truyVan: true, them: false, sua: true,  xoa: true  },
];

const headerCls =
  "bg-[#0B6FB8] text-white text-xs font-semibold uppercase tracking-wide whitespace-nowrap";

export function PermissionManagement() {
  const [tab, setTab] = useState<TabKey>("func");

  // top toolbar
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [funcCode, setFuncCode] = useState("");
  const [funcName, setFuncName] = useState("");
  const [status, setStatus] = useState<string>("all");

  // sub-filter
  const [filterLoai, setFilterLoai] = useState<string>("all");
  const [filterDanhMuc, setFilterDanhMuc] = useState<string>("all");
  const [filterTruong, setFilterTruong] = useState<string>("all");
  const [filterMoTa, setFilterMoTa] = useState("");

  const [funcRows, setFuncRows] = useState<FuncRow[]>(seedFunc);
  const [dataRows, setDataRows] = useState<DataRow[]>(seedData);
  const [selectedFunc, setSelectedFunc] = useState<Set<string>>(new Set());
  const [selectedData, setSelectedData] = useState<Set<string>>(new Set());

  // pagination
  const [pageFunc, setPageFunc] = useState(1);
  const [pageData, setPageData] = useState(1);
  const pageSize = 10;

  const filteredFunc = useMemo(() => funcRows.filter(r =>
    (filterLoai === "all" || r.loai === filterLoai) &&
    (filterDanhMuc === "all" || r.danhMuc === filterDanhMuc) &&
    (!filterMoTa || r.moTa.toLowerCase().includes(filterMoTa.toLowerCase())) &&
    (!funcCode || r.ma.toLowerCase().includes(funcCode.toLowerCase())) &&
    (!funcName || r.moTa.toLowerCase().includes(funcName.toLowerCase()))
  ), [funcRows, filterLoai, filterDanhMuc, filterMoTa, funcCode, funcName]);

  const filteredData = useMemo(() => dataRows.filter(r =>
    (filterTruong === "all" || r.truong === filterTruong) &&
    (filterDanhMuc === "all" || r.danhMuc === filterDanhMuc) &&
    (!filterMoTa || r.moTa.toLowerCase().includes(filterMoTa.toLowerCase())) &&
    (!funcCode || r.ma.toLowerCase().includes(funcCode.toLowerCase()))
  ), [dataRows, filterTruong, filterDanhMuc, filterMoTa, funcCode]);

  const togglePerm = (
    id: string,
    field: "truyVan" | "them" | "sua" | "xoa",
    value: boolean,
  ) => {
    if (tab === "func") {
      setFuncRows(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r));
    } else {
      setDataRows(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r));
    }
  };

  const toggleSelect = (id: string) => {
    if (tab === "func") {
      const s = new Set(selectedFunc);
      s.has(id) ? s.delete(id) : s.add(id);
      setSelectedFunc(s);
    } else {
      const s = new Set(selectedData);
      s.has(id) ? s.delete(id) : s.add(id);
      setSelectedData(s);
    }
  };

  const allSelected = tab === "func"
    ? filteredFunc.length > 0 && filteredFunc.every(r => selectedFunc.has(r.id))
    : filteredData.length > 0 && filteredData.every(r => selectedData.has(r.id));

  const toggleSelectAll = (v: boolean) => {
    if (tab === "func") {
      setSelectedFunc(v ? new Set(filteredFunc.map(r => r.id)) : new Set());
    } else {
      setSelectedData(v ? new Set(filteredData.map(r => r.id)) : new Set());
    }
  };

  const resetFilters = () => {
    setGroupCode(""); setGroupName(""); setFuncCode(""); setFuncName(""); setStatus("all");
    setFilterLoai("all"); setFilterDanhMuc("all"); setFilterTruong("all"); setFilterMoTa("");
  };

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6 bg-slate-200">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-[#1F2937]">Quản lý phân quyền</h2>
          <p className="text-xs text-gray-500 mt-1">Cấu hình quyền truy cập chức năng và dữ liệu cho từng nhóm người dùng</p>
        </div>
      </div>

      {/* Top search toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Mã nhóm NSD</Label>
            <Input value={groupCode} onChange={e => setGroupCode(e.target.value)} placeholder="Nhập mã nhóm" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Tên nhóm NSD</Label>
            <Input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Nhập tên nhóm" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Mã chức năng</Label>
            <Input value={funcCode} onChange={e => setFuncCode(e.target.value)} placeholder="VD: SYS_USER" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Tên chức năng</Label>
            <Input value={funcName} onChange={e => setFuncName(e.target.value)} placeholder="Nhập tên chức năng" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-600">Trạng thái</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-end gap-2">
            <Button variant="outline" className="h-9" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-1.5" /> Đặt lại
            </Button>
            <Button className="h-9 bg-[#0B6FB8] hover:bg-[#095a96] text-white">
              <Search className="h-4 w-4 mr-1.5" /> Tìm kiếm
            </Button>
            <Button className="h-9 bg-[#FE9D58] hover:bg-[#ea580c] text-white transition-all shadow-md hover:shadow-lg active:scale-95">
              <Plus className="h-4 w-4 mr-1.5" /> Lưu quyền
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs + filter + grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-200">
          {([
            { k: "func", label: "Phân quyền chức năng" },
            { k: "data", label: "Phân quyền dữ liệu" },
          ] as { k: TabKey; label: string }[]).map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.k
                  ? "text-[#0B6FB8]"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t.label}
              {tab === t.k && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#0B6FB8] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Sub-filter */}
        <div className="px-4 py-3 bg-slate-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {tab === "func" ? (
              <div className="space-y-1">
                <Label className="text-[11px] text-gray-600">Loại chức năng</Label>
                <Select value={filterLoai} onValueChange={setFilterLoai}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {loaiOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-[11px] text-gray-600">Tên trường</Label>
                <Select value={filterTruong} onValueChange={setFilterTruong}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {truongOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-[11px] text-gray-600">Danh mục chức năng</Label>
              <Select value={filterDanhMuc} onValueChange={setFilterDanhMuc}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {danhMucOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-[11px] text-gray-600">Mô tả</Label>
              <Input
                value={filterMoTa}
                onChange={e => setFilterMoTa(e.target.value)}
                placeholder="Tìm theo mô tả..."
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          {tab === "func" ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={cn(headerCls, "w-10 text-center")}>
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(v) => toggleSelectAll(!!v)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#0B6FB8]"
                    />
                  </TableHead>
                  <TableHead className={cn(headerCls, "w-12 text-center text-white")}>STT</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Loại chức năng</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Mã chức năng</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Mô tả</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Truy vấn</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Thêm</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Sửa</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFunc.map((r, idx) => (
                  <TableRow key={r.id} className="hover:bg-orange-50/40">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedFunc.has(r.id)}
                        onCheckedChange={() => toggleSelect(r.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center text-xs text-gray-600">{idx + 1}</TableCell>
                    <TableCell className="text-sm">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {r.loai}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-mono font-medium text-[#0B6FB8]">{r.ma}</TableCell>
                    <TableCell className="text-sm text-gray-700">{r.moTa}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.truyVan} onCheckedChange={(v) => togglePerm(r.id, "truyVan", !!v)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.them} onCheckedChange={(v) => togglePerm(r.id, "them", !!v)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.sua} onCheckedChange={(v) => togglePerm(r.id, "sua", !!v)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.xoa} onCheckedChange={(v) => togglePerm(r.id, "xoa", !!v)} />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFunc.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-gray-500 py-8">
                      Không có dữ liệu phù hợp
                    </TableCell>
                  </TableRow>
                )}
                <PagerRow
                  colSpan={9}
                  page={pageFunc}
                  setPage={setPageFunc}
                  total={filteredFunc.length}
                  pageSize={pageSize}
                />
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={cn(headerCls, "w-10 text-center")}>
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(v) => toggleSelectAll(!!v)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#0B6FB8]"
                    />
                  </TableHead>
                  <TableHead className={cn(headerCls, "w-12 text-center text-white")}>STT</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Loại chức năng</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Mã chức năng</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Tên trường dữ liệu</TableHead>
                  <TableHead className={cn(headerCls, "text-white")}>Mô tả</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Truy vấn</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Thêm</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Sửa</TableHead>
                  <TableHead className={cn(headerCls, "text-white text-center w-20")}>Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((r, idx) => (
                  <TableRow key={r.id} className="hover:bg-orange-50/40">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedData.has(r.id)}
                        onCheckedChange={() => toggleSelect(r.id)}
                      />
                    </TableCell>
                    <TableCell className="text-center text-xs text-gray-600">{idx + 1}</TableCell>
                    <TableCell className="text-sm">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {r.loai}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-mono font-medium text-[#0B6FB8]">{r.ma}</TableCell>
                    <TableCell className="text-sm font-mono text-gray-800">{r.truong}</TableCell>
                    <TableCell className="text-sm text-gray-700">{r.moTa}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.truyVan} onCheckedChange={(v) => togglePerm(r.id, "truyVan", !!v)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.them} onCheckedChange={(v) => togglePerm(r.id, "them", !!v)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.sua} onCheckedChange={(v) => togglePerm(r.id, "sua", !!v)} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.xoa} onCheckedChange={(v) => togglePerm(r.id, "xoa", !!v)} />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-sm text-gray-500 py-8">
                      Không có dữ liệu phù hợp
                    </TableCell>
                  </TableRow>
                )}
                <PagerRow
                  colSpan={10}
                  page={pageData}
                  setPage={setPageData}
                  total={filteredData.length}
                  pageSize={pageSize}
                />
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

function PagerRow({
  colSpan,
  page,
  setPage,
  total,
  pageSize,
}: {
  colSpan: number;
  page: number;
  setPage: (p: number) => void;
  total: number;
  pageSize: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const shown = Math.min(total, current * pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <TableRow className="hover:bg-transparent bg-slate-50">
      <TableCell colSpan={colSpan} className="py-2.5">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>
            Hiển thị <span className="font-medium text-[#1F2937]">{shown}</span> / <span className="font-medium text-[#1F2937]">{total}</span> bản ghi
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, current - 1))}
              disabled={current === 1}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "h-7 min-w-[28px] px-2 inline-flex items-center justify-center rounded-md border text-xs font-medium transition-colors",
                  p === current
                    ? "bg-[#0B6FB8] border-[#0B6FB8] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, current + 1))}
              disabled={current === totalPages}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
