import { useState } from "react";
import { Search, Plus, Pencil, Trash2, KeyRound, UsersRound, X } from "lucide-react";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Status = "active" | "inactive" | "locked";

interface UserRow {
  id: string;
  account: string;
  name: string;
  group: string;
  status: Status;
  createdAt: string;
}

const groups = ["Quản trị viên", "Quản lý dự án", "Nhân viên", "Khách"];

const statusMeta: Record<Status, { label: string; cls: string }> = {
  active:   { label: "Đang hoạt động", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  inactive: { label: "Ngưng hoạt động", cls: "bg-slate-100 text-slate-600 border border-slate-200" },
  locked:   { label: "Bị khóa", cls: "bg-red-50 text-red-700 border border-red-200" },
};

const seed: UserRow[] = [
  { id: "1", account: "thupt", name: "Phạm Thu Hà", group: "Quản trị viên", status: "active", createdAt: "2025-01-12" },
  { id: "2", account: "buingocanh", name: "Bùi Ngọc Anh", group: "Quản lý dự án", status: "active", createdAt: "2025-02-04" },
  { id: "3", account: "lequocbao", name: "Lê Quốc Bảo", group: "Nhân viên", status: "inactive", createdAt: "2025-03-22" },
  { id: "4", account: "vumailinh", name: "Vũ Mai Linh", group: "Quản lý dự án", status: "active", createdAt: "2025-04-18" },
  { id: "5", account: "hoangtk", name: "Hoàng Trung Kiên", group: "Nhân viên", status: "locked", createdAt: "2025-05-09" },
  { id: "6", account: "dovanson", name: "Đỗ Văn Sơn", group: "Khách", status: "inactive", createdAt: "2025-06-01" },
];

const headerCls = "bg-[#0B6FB8] text-white px-5 py-3 flex items-center justify-between rounded-t-lg";

export function UserManagement() {
  const [rows, setRows] = useState<UserRow[]>(seed);
  const [qAccount, setQAccount] = useState("");
  const [qStatus, setQStatus] = useState<string>("all");
  const [qGroup, setQGroup] = useState<string>("all");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<UserRow | null>(null);
  const [openDelete, setOpenDelete] = useState<UserRow | null>(null);
  const [openReset, setOpenReset] = useState<UserRow | null>(null);
  const [openGroup, setOpenGroup] = useState<UserRow | null>(null);

  const filtered = rows.filter((r) =>
    (!qAccount || r.account.toLowerCase().includes(qAccount.toLowerCase())) &&
    (qStatus === "all" || r.status === qStatus) &&
    (qGroup === "all" || r.group === qGroup)
  );

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6 bg-slate-200 min-h-full">
      {/* Search toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <Label className="text-xs text-slate-600">Tài khoản</Label>
            <Input value={qAccount} onChange={(e) => setQAccount(e.target.value)} placeholder="Nhập tài khoản..." className="mt-1.5" />
          </div>
          <div className="md:col-span-3">
            <Label className="text-xs text-slate-600">Trạng thái</Label>
            <Select value={qStatus} onValueChange={setQStatus}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                <SelectItem value="locked">Bị khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Label className="text-xs text-slate-600">Nhóm người dùng</Label>
            <Select value={qGroup} onValueChange={setQGroup}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex gap-2 justify-end">
            <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white gap-2">
              <Search className="h-4 w-4" /> Tìm kiếm
            </Button>
            <Button onClick={() => setOpenAdd(true)} className="bg-[#FE9D58] hover:bg-[#ea580c] text-white gap-2">
              <Plus className="h-4 w-4" /> Thêm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Datagrid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-14 text-center">STT</TableHead>
              <TableHead>Tài khoản</TableHead>
              <TableHead>Tên NSD</TableHead>
              <TableHead>Nhóm NSD</TableHead>
              <TableHead>Trạng thái tài khoản</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-center">Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell className="text-center text-slate-500">{i + 1}</TableCell>
                <TableCell className="font-medium text-slate-800">{r.account}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.group}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", statusMeta[r.status].cls)}>
                    {statusMeta[r.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{r.createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5">
                    <IconBtn title="Chỉnh sửa" color="text-blue-600 hover:bg-blue-50" onClick={() => setOpenEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Xóa" color="text-red-600 hover:bg-red-50" onClick={() => setOpenDelete(r)}>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Reset mật khẩu" color="text-amber-600 hover:bg-amber-50" onClick={() => setOpenReset(r)}>
                      <KeyRound className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Xếp nhóm quyền" color="text-emerald-600 hover:bg-emerald-50" onClick={() => setOpenGroup(r)}>
                      <UsersRound className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add new */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="p-0 overflow-hidden max-w-lg">
          <div className={headerCls}>
            <DialogTitle className="text-white text-base font-semibold">Thêm mới tài khoản</DialogTitle>
            <DialogClose className="text-white/80 hover:text-white"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="p-6 space-y-4">
            <FormRow label="Tài khoản"><Input /></FormRow>
            <FormRow label="Mật khẩu"><Input type="password" /></FormRow>
            <FormRow label="Nhập lại mật khẩu"><Input type="password" /></FormRow>
            <FormRow label="Tên NSD"><Input /></FormRow>
            <FormRow label="Gán nhóm NSD">
              <Select>
                <SelectTrigger><SelectValue placeholder="Chọn nhóm..." /></SelectTrigger>
                <SelectContent>
                  {groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Trạng thái">
              <Select defaultValue="active">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                  <SelectItem value="locked">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </FormRow>
          </div>
          <DialogFooter className="px-6 pb-5">
            <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => setOpenAdd(false)}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!openEdit} onOpenChange={(v) => !v && setOpenEdit(null)}>
        <DialogContent className="p-0 overflow-hidden max-w-lg">
          <div className={headerCls}>
            <DialogTitle className="text-white text-base font-semibold">Chỉnh sửa tài khoản</DialogTitle>
            <DialogClose className="text-white/80 hover:text-white"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="p-6 space-y-4">
            <FormRow label="Tài khoản"><Input defaultValue={openEdit?.account} disabled /></FormRow>
            <FormRow label="Tên NSD"><Input defaultValue={openEdit?.name} /></FormRow>
            <FormRow label="Trạng thái">
              <Select defaultValue={openEdit?.status}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                  <SelectItem value="locked">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </FormRow>
          </div>
          <DialogFooter className="px-6 pb-5">
            <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => setOpenEdit(null)}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!openDelete} onOpenChange={(v) => !v && setOpenDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Bạn có muốn xóa tài khoản <span className="font-semibold text-slate-900">{openDelete?.account}</span> không?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(null)}>Từ chối</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (openDelete) setRows((rs) => rs.filter((x) => x.id !== openDelete.id));
                setOpenDelete(null);
              }}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!openReset} onOpenChange={(v) => !v && setOpenReset(null)}>
        <DialogContent className="p-0 overflow-hidden max-w-lg">
          <div className={headerCls}>
            <DialogTitle className="text-white text-base font-semibold">Reset mật khẩu</DialogTitle>
            <DialogClose className="text-white/80 hover:text-white"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="p-6 space-y-4">
            <FormRow label="Mật khẩu mới"><Input type="password" /></FormRow>
            <FormRow label="Nhập lại mật khẩu"><Input type="password" /></FormRow>
          </div>
          <DialogFooter className="px-6 pb-5">
            <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => setOpenReset(null)}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign group */}
      <Dialog open={!!openGroup} onOpenChange={(v) => !v && setOpenGroup(null)}>
        <DialogContent className="p-0 overflow-hidden max-w-lg">
          <div className={headerCls}>
            <DialogTitle className="text-white text-base font-semibold">Xếp nhóm NSD</DialogTitle>
            <DialogClose className="text-white/80 hover:text-white"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="p-6 space-y-3">
            {groups.map((g) => (
              <label key={g} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <Checkbox defaultChecked={openGroup?.group === g} />
                <span className="text-sm text-slate-700">{g}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="px-6 pb-5">
            <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => setOpenGroup(null)}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IconBtn({ children, color, title, onClick }: { children: React.ReactNode; color: string; title: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} className={cn("p-1.5 rounded-md transition-colors", color)}>
      {children}
    </button>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-center">
      <Label className="text-sm text-slate-700 col-span-1">{label}</Label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}