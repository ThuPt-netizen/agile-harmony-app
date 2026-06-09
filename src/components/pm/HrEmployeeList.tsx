import { useState, useMemo } from "react";
import { Search, Plus, Trash2, FileEdit, X, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Emp {
  id: string;
  avatar: string;
  name: string;
  username: string;
  group: string;
  dob: string;
  gender: "Nam" | "Nữ";
  position: string;
  contract: string;
  startDate: string;
}

const avatars = [
  "https://i.pravatar.cc/80?img=1","https://i.pravatar.cc/80?img=5","https://i.pravatar.cc/80?img=9",
  "https://i.pravatar.cc/80?img=11","https://i.pravatar.cc/80?img=12","https://i.pravatar.cc/80?img=15",
  "https://i.pravatar.cc/80?img=20","https://i.pravatar.cc/80?img=23","https://i.pravatar.cc/80?img=25",
  "https://i.pravatar.cc/80?img=32",
];

const seed: Emp[] = [
  { id: "1", avatar: avatars[0], name: "Phạm Thị Huyền Trang", username: "Trangpth", group: "PERMISSION_DEFAULT", dob: "26/08/1995", gender: "Nữ", position: "Kinh doanh", contract: "", startDate: "12/03/2026" },
  { id: "2", avatar: avatars[1], name: "Đỗ Khánh Linh", username: "linhdk", group: "PERMISSION_DEFAULT", dob: "23/06/2003", gender: "Nữ", position: "TTS", contract: "", startDate: "19/11/2025" },
  { id: "3", avatar: avatars[2], name: "Phạm Thị Ngọc Ánh", username: "anhptn", group: "PERMISSION_DEFAULT", dob: "23/01/2003", gender: "Nữ", position: "TTS", contract: "", startDate: "11/11/2025" },
  { id: "4", avatar: avatars[3], name: "Nguyễn Thị Thu Trang", username: "Trangntt", group: "PERMISSION_DEFAULT", dob: "29/06/2002", gender: "Nữ", position: "TTS", contract: "", startDate: "11/11/2025" },
  { id: "5", avatar: avatars[4], name: "Lê Thị Lài", username: "Lailt", group: "PERMISSION_DEFAULT", dob: "25/06/1989", gender: "Nữ", position: "Kế toán trưởng", contract: "", startDate: "15/05/2011" },
  { id: "6", avatar: avatars[5], name: "Nguyễn Quang Dũng", username: "dungnq55", group: "PERMISSION_DEFAULT", dob: "10/11/1980", gender: "Nam", position: "Kinh doanh", contract: "Hợp đồng không thời hạn", startDate: "15/07/2025" },
  { id: "7", avatar: avatars[6], name: "Nguyễn Kim Chi", username: "ChiNK", group: "PERMISSION_DEFAULT", dob: "03/06/2003", gender: "Nữ", position: "Tester", contract: "Thử việc", startDate: "11/08/2025" },
  { id: "8", avatar: avatars[7], name: "Dương Đức Huy", username: "huydd", group: "PERMISSION_DEFAULT", dob: "26/07/2001", gender: "Nam", position: "Coder", contract: "Hợp đồng 1 năm", startDate: "09/12/2024" },
  { id: "9", avatar: avatars[8], name: "Bùi Hồng Giang", username: "Giangbh", group: "PERMISSION_DEFAULT", dob: "16/03/2002", gender: "Nữ", position: "Tester", contract: "Hợp đồng 1 năm", startDate: "05/09/2024" },
  { id: "10", avatar: avatars[9], name: "Nguyễn Viết Quang Tùng", username: "tungnvq2", group: "PERMISSION_DEFAULT", dob: "05/02/2002", gender: "Nam", position: "Coder", contract: "Hợp đồng 1 năm", startDate: "04/09/2024" },
];

export function HrEmployeeList() {
  const [rows] = useState<Emp[]>(seed);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [advanced, setAdvanced] = useState(false);
  const [qName, setQName] = useState("");
  const [qPosition, setQPosition] = useState("all");
  const [qContract, setQContract] = useState("all");
  const [qGender, setQGender] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);

  const filtered = useMemo(() => rows.filter(r =>
    (!qName || r.name.toLowerCase().includes(qName.toLowerCase())) &&
    (qPosition === "all" || r.position === qPosition) &&
    (qContract === "all" || r.contract === qContract) &&
    (qGender === "all" || r.gender === qGender)
  ), [rows, qName, qPosition, qContract, qGender]);

  const allChecked = filtered.length > 0 && filtered.every(r => selected.has(r.id));
  const someChecked = selected.size > 0;

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const positions = Array.from(new Set(rows.map(r => r.position)));
  const contracts = Array.from(new Set(rows.map(r => r.contract).filter(Boolean)));

  const selectedNames = rows.filter(r => selected.has(r.id)).map(r => r.name);

  return (
    <div className="px-6 lg:px-10 py-6 space-y-5 bg-slate-200 min-h-full">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Quản lý nhân sự</h2>
        <div className="flex items-center gap-2">
          <ActionBtn
            icon={<FileEdit className="h-4 w-4" />}
            label="Quyết định thôi việc"
            disabled={!someChecked}
            onClick={() => setConfirmQuit(true)}
          />
          <ActionBtn
            icon={<Trash2 className="h-4 w-4" />}
            label="Xóa"
            disabled={!someChecked}
            onClick={() => setConfirmDelete(true)}
          />
          <ActionBtn
            icon={<Plus className="h-4 w-4" />}
            label="Thêm"
            disabled={someChecked}
            primary
          />
        </div>
      </div>

      {/* Search panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Switch checked={advanced} onCheckedChange={setAdvanced} />
          <span className="text-sm text-slate-700 font-medium">Tìm kiếm nâng cao</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="text-xs text-slate-500">Họ và tên</label>
            <Input value={qName} onChange={e => setQName(e.target.value)} placeholder="Họ và tên" className="mt-1.5" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-slate-500">Vị trí</label>
            <Select value={qPosition} onValueChange={setQPosition}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Vị trí" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Loại hợp đồng</label>
            <Select value={qContract} onValueChange={setQContract}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {contracts.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500">Giới tính</label>
            <Select value={qGender} onValueChange={setQGender}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <button className="w-full h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium inline-flex items-center justify-center gap-2">
              <Search className="h-4 w-4" /> Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b border-slate-200">
                <th className="px-4 py-3 w-10"><Checkbox checked={allChecked} onCheckedChange={toggleAll} /></th>
                <th className="px-3 py-3 font-medium">Ảnh</th>
                <th className="px-3 py-3 font-medium">Họ và tên</th>
                <th className="px-3 py-3 font-medium">Tài khoản đăng nhập</th>
                <th className="px-3 py-3 font-medium">Nhóm đã được thêm</th>
                <th className="px-3 py-3 font-medium">Ngày sinh</th>
                <th className="px-3 py-3 font-medium">Giới tính</th>
                <th className="px-3 py-3 font-medium">Vị trí làm việc</th>
                <th className="px-3 py-3 font-medium">Hợp đồng</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">Ngày bắt đầu làm việc</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const checked = selected.has(r.id);
                return (
                  <tr key={r.id} className={cn("border-b border-slate-100 transition-colors", checked ? "bg-blue-50/60" : "hover:bg-slate-50")}>
                    <td className="px-4 py-2.5"><Checkbox checked={checked} onCheckedChange={() => toggleOne(r.id)} /></td>
                    <td className="px-3 py-2.5">
                      <img src={r.avatar} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
                    </td>
                    <td className="px-3 py-2.5"><span className="text-blue-600 hover:underline cursor-pointer font-medium">{r.name}</span></td>
                    <td className="px-3 py-2.5 text-slate-700">{r.username}</td>
                    <td className="px-3 py-2.5 text-slate-700">{r.group}</td>
                    <td className="px-3 py-2.5 text-slate-700">{r.dob}</td>
                    <td className="px-3 py-2.5 text-slate-700">{r.gender}</td>
                    <td className="px-3 py-2.5 text-slate-700">{r.position}</td>
                    <td className="px-3 py-2.5 text-slate-700">{r.contract || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-700">{r.startDate}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-500">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Hiển thị</span>
            <Select defaultValue="10">
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["10","20","50","100"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <span>/{rows.length} bản ghi</span>
            <button className="ml-1 p-1.5 rounded hover:bg-slate-100" title="Tải xuống">
              <Download className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <PageBtn><ChevronsLeft className="h-4 w-4" /></PageBtn>
            <PageBtn><ChevronLeft className="h-4 w-4" /></PageBtn>
            {[1,2,3,4,5,6].map(p => (
              <button key={p} className={cn("h-8 w-8 rounded text-sm", p === 1 ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100")}>{p}</button>
            ))}
            <PageBtn><ChevronRight className="h-4 w-4" /></PageBtn>
            <PageBtn><ChevronsRight className="h-4 w-4" /></PageBtn>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="p-0 overflow-hidden max-w-md">
          <div className="flex items-center justify-between px-5 py-3.5 border-b">
            <DialogTitle className="text-base font-semibold">Xác nhận xóa</DialogTitle>
            <DialogClose className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="px-5 py-5 text-sm text-slate-700">
            Bạn có chắc muốn xóa {selected.size} bản ghi{" "}
            <span className="font-semibold text-red-600">
              {selectedNames.slice(0, 3).join(", ")}{selectedNames.length > 3 ? "…" : ""}
            </span>
            ?
          </div>
          <div className="px-5 pb-4 flex justify-end gap-2">
            <button onClick={() => setConfirmDelete(false)} className="h-9 px-4 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-slate-50">Xác nhận</button>
            <button onClick={() => setConfirmDelete(false)} className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-sm text-white">Đóng</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quit confirm */}
      <Dialog open={confirmQuit} onOpenChange={setConfirmQuit}>
        <DialogContent className="p-0 overflow-hidden max-w-md">
          <div className="flex items-center justify-between px-5 py-3.5 border-b">
            <DialogTitle className="text-base font-semibold">Quyết định thôi việc</DialogTitle>
            <DialogClose className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="px-5 py-5 text-sm text-slate-700">
            Xác nhận ra quyết định thôi việc cho {selected.size} nhân sự đã chọn?
          </div>
          <div className="px-5 pb-4 flex justify-end gap-2">
            <button onClick={() => setConfirmQuit(false)} className="h-9 px-4 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-slate-50">Hủy</button>
            <button onClick={() => setConfirmQuit(false)} className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-sm text-white">Xác nhận</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActionBtn({ icon, label, disabled, primary, onClick }: { icon: React.ReactNode; label: string; disabled?: boolean; primary?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 transition-all",
        disabled
          ? "text-slate-400 cursor-not-allowed"
          : primary
            ? "text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            : "text-slate-700 hover:bg-slate-100"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function PageBtn({ children }: { children: React.ReactNode }) {
  return <button className="h-8 w-8 inline-flex items-center justify-center rounded text-slate-500 hover:bg-slate-100">{children}</button>;
}