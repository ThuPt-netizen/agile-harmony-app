import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Check, ChevronsUpDown } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Status = "active" | "inactive";

interface GroupRow {
  id: string;
  code: string;
  name: string;
  members: string[];
  status: Status;
  createdAt: string;
}

const allUsers = [
  "Phạm Thu Hà",
  "Bùi Ngọc Anh",
  "Lê Quốc Bảo",
  "Vũ Mai Linh",
  "Hoàng Trung Kiên",
  "Đỗ Văn Sơn",
];

const statusMeta: Record<Status, { label: string; cls: string }> = {
  active:   { label: "Đang hoạt động", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  inactive: { label: "Ngưng hoạt động", cls: "bg-slate-100 text-slate-600 border border-slate-200" },
};

const seed: GroupRow[] = [
  { id: "1", code: "ADMIN",   name: "Quản trị viên",   members: ["Phạm Thu Hà"],                              status: "active",   createdAt: "2025-01-12" },
  { id: "2", code: "PM",      name: "Quản lý dự án",   members: ["Bùi Ngọc Anh", "Vũ Mai Linh"],              status: "active",   createdAt: "2025-02-04" },
  { id: "3", code: "STAFF",   name: "Nhân viên",       members: ["Lê Quốc Bảo", "Hoàng Trung Kiên"],          status: "active",   createdAt: "2025-03-22" },
  { id: "4", code: "GUEST",   name: "Khách",           members: ["Đỗ Văn Sơn"],                                status: "inactive", createdAt: "2025-04-01" },
];

const headerCls = "bg-[#0B6FB8] text-white px-5 py-3 flex items-center justify-between rounded-t-lg";

export function UserGroupManagement() {
  const [rows, setRows] = useState<GroupRow[]>(seed);
  const [qCode, setQCode] = useState("");
  const [qStatus, setQStatus] = useState<string>("all");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<GroupRow | null>(null);
  const [openDelete, setOpenDelete] = useState<GroupRow | null>(null);

  const filtered = rows.filter((r) =>
    (!qCode || r.code.toLowerCase().includes(qCode.toLowerCase())) &&
    (qStatus === "all" || r.status === qStatus)
  );

  return (
    <div className="px-6 lg:px-10 py-8 space-y-6 bg-slate-200 min-h-full">
      {/* Search toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <Label className="text-xs text-slate-600">Mã nhóm NSD</Label>
            <Input value={qCode} onChange={(e) => setQCode(e.target.value)} placeholder="Nhập mã nhóm..." className="mt-1.5" />
          </div>
          <div className="md:col-span-4">
            <Label className="text-xs text-slate-600">Trạng thái</Label>
            <Select value={qStatus} onValueChange={setQStatus}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-4 flex gap-2 justify-end">
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
              <TableHead>Mã nhóm NSD</TableHead>
              <TableHead>Tên nhóm NSD</TableHead>
              <TableHead>Gán cho NSD</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-center">Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell className="text-center text-slate-500">{i + 1}</TableCell>
                <TableCell className="font-medium text-slate-800">{r.code}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.members.map((m) => (
                      <span key={m} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200">{m}</span>
                    ))}
                  </div>
                </TableCell>
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
      <GroupFormDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        title="Thêm mới Nhóm người dùng"
        onSave={(g) => {
          setRows((rs) => [...rs, { ...g, id: String(Date.now()), createdAt: new Date().toISOString().slice(0, 10) }]);
          setOpenAdd(false);
        }}
      />

      {/* Edit */}
      <GroupFormDialog
        open={!!openEdit}
        onOpenChange={(v) => !v && setOpenEdit(null)}
        title="Chỉnh sửa Nhóm người dùng"
        initial={openEdit ?? undefined}
        onSave={(g) => {
          if (openEdit) setRows((rs) => rs.map((x) => (x.id === openEdit.id ? { ...openEdit, ...g } : x)));
          setOpenEdit(null);
        }}
      />

      {/* Delete confirm */}
      <Dialog open={!!openDelete} onOpenChange={(v) => !v && setOpenDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Bạn có muốn xóa nhóm người dùng <span className="font-semibold text-slate-900">{openDelete?.name}</span> không?
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
    </div>
  );
}

function GroupFormDialog({
  open, onOpenChange, title, initial, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  initial?: GroupRow;
  onSave: (g: Omit<GroupRow, "id" | "createdAt">) => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [members, setMembers] = useState<string[]>(initial?.members ?? []);
  const [status, setStatus] = useState<Status>(initial?.status ?? "active");
  const [pickerOpen, setPickerOpen] = useState(false);

  // reset when reopened
  const key = (initial?.id ?? "new") + String(open);

  const toggle = (u: string) =>
    setMembers((m) => (m.includes(u) ? m.filter((x) => x !== u) : [...m, u]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={key}>
      <DialogContent className="p-0 overflow-hidden max-w-lg">
        <div className={headerCls}>
          <DialogTitle className="text-white text-base font-semibold">{title}</DialogTitle>
          <DialogClose className="text-white/80 hover:text-white"><X className="h-4 w-4" /></DialogClose>
        </div>
        <div className="p-6 space-y-4">
          <FormRow label="Mã nhóm NSD">
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </FormRow>
          <FormRow label="Tên nhóm NSD">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormRow>
          <FormRow label="Gán cho NSD">
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm min-h-10"
                >
                  <div className="flex flex-wrap gap-1 items-center text-left">
                    {members.length === 0 ? (
                      <span className="text-slate-400">Chọn người dùng...</span>
                    ) : (
                      members.map((m) => (
                        <span key={m} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200">{m}</span>
                      ))
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[380px] p-2" align="start">
                <div className="max-h-64 overflow-auto space-y-1">
                  {allUsers.map((u) => {
                    const checked = members.includes(u);
                    return (
                      <label key={u} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer">
                        <Checkbox checked={checked} onCheckedChange={() => toggle(u)} />
                        <span className="text-sm text-slate-700 flex-1">{u}</span>
                        {checked && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      </label>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </FormRow>
          <FormRow label="Trạng thái">
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
        </div>
        <DialogFooter className="px-6 pb-5">
          <Button
            className="bg-[#0B6FB8] hover:bg-[#095a96] text-white"
            onClick={() => onSave({ code, name, members, status })}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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