import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, ShieldCheck, UserPlus, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Status = "active" | "inactive";

interface GroupRow {
  id: string;
  name: string;
  status: Status;
  note: string;
}

const statusMeta: Record<Status, { label: string; cls: string }> = {
  active:   { label: "Đang hoạt động",  cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  inactive: { label: "Ngừng hoạt động", cls: "bg-slate-100 text-slate-600 border border-slate-200" },
};

const seed: GroupRow[] = [
  { id: "1", name: "PERMISSION_DEFAULT", status: "active",   note: "Quyền mặc định khi thêm mới, các nhân viên sẽ ở nhóm này" },
  { id: "2", name: "NHÂN VIÊN",          status: "inactive", note: "Tạm thời để ngừng hoạt động, để dùng sau này" },
  { id: "3", name: "NHÂN SỰ",            status: "active",   note: "Hoạt động" },
  { id: "4", name: "DIRECTOR",           status: "active",   note: "Nhóm các giám đốc của công ty, được xem thông tin của toàn bộ nhân sự" },
  { id: "5", name: "ADMIN",              status: "active",   note: "Nhóm quản trị hệ thống, sử dụng các chức năng quản lý người dùng, phân quyền" },
];

const headerCls = "bg-[#EAF3FB] text-[#0B6FB8] px-5 py-3 flex items-center justify-between rounded-t-lg";

export function HrUserGroups() {
  const [rows, setRows] = useState<GroupRow[]>(seed);
  const [qName, setQName] = useState("");
  const [qStatus, setQStatus] = useState<string>("all");
  const [selected, setSelected] = useState<string[]>([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<GroupRow | null>(null);
  const [openDelete, setOpenDelete] = useState<GroupRow | null>(null);
  const [openPerm, setOpenPerm] = useState<GroupRow | null>(null);
  const [openAssign, setOpenAssign] = useState<GroupRow | null>(null);

  const filtered = useMemo(
    () => rows.filter((r) =>
      (!qName || r.name.toLowerCase().includes(qName.toLowerCase())) &&
      (qStatus === "all" || r.status === qStatus)
    ),
    [rows, qName, qStatus]
  );

  const allChecked = filtered.length > 0 && filtered.every((r) => selected.includes(r.id));
  const toggleAll = () => {
    setSelected(allChecked ? [] : filtered.map((r) => r.id));
  };
  const toggleOne = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const oneRow = selected.length === 1 ? rows.find((r) => r.id === selected[0]) ?? null : null;
  const hasAny = selected.length > 0;

  return (
    <div className="px-6 lg:px-10 py-8 space-y-5 bg-slate-200 min-h-full">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <TopAction
          icon={<Pencil className="h-3.5 w-3.5" />}
          label="Cập nhật"
          color="text-amber-600"
          disabled={!oneRow}
          onClick={() => oneRow && setOpenEdit(oneRow)}
        />
        <TopAction
          icon={<Trash2 className="h-3.5 w-3.5" />}
          label="Xóa"
          color="text-red-600"
          disabled={!hasAny}
          onClick={() => oneRow && setOpenDelete(oneRow)}
        />
        <TopAction
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          label="Phân quyền"
          color="text-violet-600"
          disabled={!oneRow}
          onClick={() => oneRow && setOpenPerm(oneRow)}
        />
        <TopAction
          icon={<UserPlus className="h-3.5 w-3.5" />}
          label="Gán / gỡ NSD"
          color="text-sky-600"
          disabled={!oneRow}
          onClick={() => oneRow && setOpenAssign(oneRow)}
        />
        <button
          onClick={() => setOpenAdd(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium text-white bg-[#FE9D58] hover:bg-[#ea580c] shadow-sm shadow-orange-500/30"
        >
          <Plus className="h-3.5 w-3.5" /> Thêm
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <Label className="text-xs text-slate-600">Tên nhóm</Label>
            <Input value={qName} onChange={(e) => setQName(e.target.value)} placeholder="Nhập tên nhóm..." className="mt-1.5" />
          </div>
          <div className="md:col-span-5">
            <Label className="text-xs text-slate-600">Trạng thái</Label>
            <Select value={qStatus} onValueChange={setQStatus}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white gap-2 w-full">
              <Search className="h-4 w-4" /> Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      {/* Datagrid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EAF3FB] hover:bg-[#EAF3FB]">
              <TableHead className="w-12">
                <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead className="w-16 text-slate-700">STT</TableHead>
              <TableHead className="text-slate-700">Tên nhóm</TableHead>
              <TableHead className="text-slate-700 w-48">Trạng thái</TableHead>
              <TableHead className="text-slate-700">Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow key={r.id} className={cn(selected.includes(r.id) && "bg-blue-50/40")}>
                <TableCell>
                  <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleOne(r.id)} />
                </TableCell>
                <TableCell className="text-slate-500">{i + 1}</TableCell>
                <TableCell className="font-medium text-slate-800">{r.name}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", statusMeta[r.status].cls)}>
                    {statusMeta[r.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{r.note}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-500 border-t border-slate-100">
          <div>Hiển thị <select className="border rounded px-1 py-0.5 mx-1"><option>10</option><option>20</option></select> / {filtered.length} bản ghi</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded hover:bg-slate-100">«</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">‹</button>
            <button className="px-2 py-1 rounded bg-[#0B6FB8] text-white">1</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">›</button>
            <button className="px-2 py-1 rounded hover:bg-slate-100">»</button>
          </div>
        </div>
      </div>

      {/* Add */}
      <GroupFormDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        title="Thêm thông tin nhóm NSD"
        onSave={(g) => {
          setRows((rs) => [...rs, { ...g, id: String(Date.now()) }]);
          setOpenAdd(false);
        }}
      />

      {/* Edit */}
      <GroupFormDialog
        open={!!openEdit}
        onOpenChange={(v) => !v && setOpenEdit(null)}
        title={`Sửa thông tin nhóm NSD - ${openEdit?.name ?? ""}`}
        initial={openEdit ?? undefined}
        onSave={(g) => {
          if (openEdit) setRows((rs) => rs.map((x) => (x.id === openEdit.id ? { ...openEdit, ...g } : x)));
          setOpenEdit(null);
        }}
      />

      {/* Delete */}
      <Dialog open={!!openDelete} onOpenChange={(v) => !v && setOpenDelete(null)}>
        <DialogContent className="p-0 overflow-hidden max-w-md">
          <div className={headerCls}>
            <DialogTitle className="text-[#0B6FB8] text-base font-semibold">Xác nhận xóa</DialogTitle>
            <DialogClose className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></DialogClose>
          </div>
          <div className="px-6 py-5 text-sm text-slate-700">
            Bạn có chắc muốn xóa 1 bản ghi <span className="font-semibold text-red-600">{openDelete?.name}</span>?
          </div>
          <DialogFooter className="px-6 pb-5 gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(null)}>Đóng</Button>
            <Button
              className="bg-[#0B6FB8] hover:bg-[#095a96] text-white"
              onClick={() => {
                if (openDelete) {
                  setRows((rs) => rs.filter((x) => x.id !== openDelete.id));
                  setSelected((s) => s.filter((x) => x !== openDelete.id));
                }
                setOpenDelete(null);
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions */}
      <PermissionDialog
        open={!!openPerm}
        onOpenChange={(v) => !v && setOpenPerm(null)}
        groupName={openPerm?.name ?? ""}
      />

      {/* Assign / unassign */}
      <AssignDialog
        open={!!openAssign}
        onOpenChange={(v) => !v && setOpenAssign(null)}
        group={openAssign}
      />
    </div>
  );
}

function TopAction({
  icon, label, color, disabled, onClick,
}: { icon: React.ReactNode; label: string; color: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium bg-white border border-slate-200 transition-all",
        disabled ? "text-slate-300 cursor-not-allowed" : cn(color, "hover:bg-slate-50 hover:shadow-sm")
      )}
    >
      {icon} {label}
    </button>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm text-slate-700">{label}:</Label>
      <div className="mt-1.5">{children}</div>
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
  onSave: (g: Omit<GroupRow, "id">) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "active");
  const [note, setNote] = useState(initial?.note ?? "");
  const key = (initial?.id ?? "new") + String(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={key}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <div className={headerCls}>
          <DialogTitle className="text-[#0B6FB8] text-base font-semibold">{title}</DialogTitle>
          <DialogClose className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></DialogClose>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormRow label="Tên nhóm">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-50" />
          </FormRow>
          <FormRow label="Trạng thái">
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>
          <div className="md:col-span-2">
            <FormRow label="Ghi chú">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="bg-slate-50 min-h-[80px]" />
            </FormRow>
          </div>
        </div>
        <DialogFooter className="px-6 pb-5 gap-2">
          <Button variant="outline" onClick={() => onSave({ name, status, note })}>Xác nhận</Button>
          <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Permission tree ---------------- */

type PermNode = { id: string; label: string; children?: PermNode[] };

const permTree: PermNode[] = [
  { id: "home", label: "Trang chủ" },
  {
    id: "system", label: "Hệ thống",
    children: [
      { id: "system.group", label: "Quản lý nhóm", children: [
        { id: "system.group.delete", label: "Xóa" },
        { id: "system.group.update", label: "Cập nhật" },
        { id: "system.group.add", label: "Thêm mới" },
        { id: "system.group.view", label: "Xem chi tiết" },
        { id: "system.group.assign", label: "Gán/gỡ người dùng" },
        { id: "system.group.perm", label: "Phân quyền" },
        { id: "system.group.list", label: "Danh sách" },
      ]},
    ],
  },
  {
    id: "hr", label: "Nhân sự",
    children: [
      { id: "hr.salary", label: "Lịch sử lương", children: [
        { id: "hr.salary.list", label: "Danh sách" },
        { id: "hr.salary.add",  label: "Thêm mới" },
        { id: "hr.salary.view", label: "Xem chi tiết" },
        { id: "hr.salary.update", label: "Cập nhật" },
        { id: "hr.salary.delete", label: "Xóa" },
        { id: "hr.salary.all",  label: "Xem toàn bộ thông tin" },
      ]},
      { id: "hr.bonus", label: "Nhận thưởng - khen thưởng", children: [
        { id: "hr.bonus.all", label: "Xem toàn bộ thông tin" },
      ]},
      { id: "hr.mgmt", label: "Quản lý nhân sự", children: [
        { id: "hr.mgmt.list", label: "Danh sách" },
        { id: "hr.mgmt.personal", label: "Xem thông tin cá nhân" },
        { id: "hr.mgmt.delete", label: "Xóa" },
        { id: "hr.mgmt.add", label: "Thêm mới" },
        { id: "hr.mgmt.view", label: "Xem chi tiết" },
        { id: "hr.mgmt.update", label: "Cập nhật" },
        { id: "hr.mgmt.all", label: "Xem toàn bộ" },
      ]},
      { id: "hr.contract", label: "Hợp đồng lao động", children: [
        { id: "hr.contract.list", label: "Danh sách" },
        { id: "hr.contract.add", label: "Thêm mới" },
        { id: "hr.contract.update", label: "Cập nhật" },
        { id: "hr.contract.detail", label: "Chi tiết" },
        { id: "hr.contract.delete", label: "Xóa" },
        { id: "hr.contract.all", label: "Xem toàn bộ thông tin" },
      ]},
      { id: "hr.mei", label: "Mei của nhân sự", children: [
        { id: "hr.mei.list", label: "Danh sách" },
        { id: "hr.mei.add", label: "Thêm mới" },
        { id: "hr.mei.view", label: "Xem chi tiết" },
        { id: "hr.mei.update", label: "Cập nhật" },
        { id: "hr.mei.delete", label: "Xóa" },
      ]},
      { id: "hr.violation", label: "Vi phạm", children: [
        { id: "hr.violation.list", label: "Danh sách" },
        { id: "hr.violation.add", label: "Thêm mới" },
        { id: "hr.violation.view", label: "Xem chi tiết" },
        { id: "hr.violation.update", label: "Cập nhật" },
        { id: "hr.violation.delete", label: "Xóa" },
        { id: "hr.violation.all", label: "Xem toàn bộ thông tin" },
      ]},
      { id: "hr.evaluation", label: "Đánh giá nhân sự", children: [
        { id: "hr.evaluation.list", label: "Danh sách" },
        { id: "hr.evaluation.add", label: "Thêm mới" },
        { id: "hr.evaluation.update", label: "Cập nhật" },
        { id: "hr.evaluation.detail", label: "Chi tiết" },
        { id: "hr.evaluation.delete", label: "Xóa" },
        { id: "hr.evaluation.all", label: "Xem toàn bộ thông tin" },
      ]},
    ],
  },
  {
    id: "candidate", label: "Ứng viên",
    children: [
      { id: "candidate.mgmt", label: "Quản lý ứng viên", children: [
        { id: "candidate.mgmt.list", label: "Danh sách" },
        { id: "candidate.mgmt.add", label: "Thêm mới" },
        { id: "candidate.mgmt.view", label: "Xem chi tiết" },
        { id: "candidate.mgmt.update", label: "Cập nhật" },
        { id: "candidate.mgmt.delete", label: "Xóa" },
        { id: "candidate.mgmt.transfer", label: "Chuyển nhân sự" },
      ]},
    ],
  },
  {
    id: "project", label: "Dự án",
    children: [
      { id: "project.mgmt", label: "Quản lý dự án", children: [
        { id: "project.mgmt.list", label: "Danh sách" },
        { id: "project.mgmt.add", label: "Thêm mới" },
        { id: "project.mgmt.view", label: "Xem chi tiết" },
        { id: "project.mgmt.update", label: "Cập nhật" },
        { id: "project.mgmt.assign", label: "Gán / gỡ nhân sự" },
        { id: "project.mgmt.delete", label: "Xóa" },
      ]},
      { id: "project.mei", label: "Tra cứu thông tin mei của dự án theo tháng" },
    ],
  },
  {
    id: "att", label: "Chấm công",
    children: [
      { id: "att.mgmt", label: "Quản lý chấm công", children: [
        { id: "att.mgmt.list", label: "Danh sách" },
        { id: "att.mgmt.add", label: "Thêm mới" },
        { id: "att.mgmt.update", label: "Cập nhật" },
        { id: "att.mgmt.import", label: "Import file chấm công" },
        { id: "att.mgmt.export", label: "Kết xuất" },
      ]},
    ],
  },
];

function collectIds(node: PermNode): string[] {
  return [node.id, ...(node.children?.flatMap(collectIds) ?? [])];
}

function PermissionDialog({
  open, onOpenChange, groupName,
}: { open: boolean; onOpenChange: (v: boolean) => void; groupName: string }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["system", "hr", "hr.salary", "hr.mgmt", "att", "att.mgmt"])
  );

  const toggleCheck = (node: PermNode) => {
    setChecked((prev) => {
      const next = new Set(prev);
      const ids = collectIds(node);
      const allOn = ids.every((id) => next.has(id));
      ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const nodeState = (node: PermNode): "on" | "off" | "partial" => {
    if (!node.children?.length) return checked.has(node.id) ? "on" : "off";
    const ids = collectIds(node).filter((x) => x !== node.id);
    const onCount = ids.filter((id) => checked.has(id)).length;
    if (onCount === 0) return "off";
    if (onCount === ids.length) return "on";
    return "partial";
  };

  const renderNode = (node: PermNode, depth: number) => {
    const state = nodeState(node);
    const isOpen = expanded.has(node.id);
    const hasChildren = !!node.children?.length;
    return (
      <div key={node.id}>
        <div className="flex items-center gap-2 py-1" style={{ paddingLeft: depth * 18 }}>
          {hasChildren ? (
            <button onClick={() => toggleExpand(node.id)} className="text-slate-400 hover:text-slate-700">
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}
          <Checkbox
            checked={state === "on" ? true : state === "partial" ? "indeterminate" : false}
            onCheckedChange={() => toggleCheck(node)}
          />
          <span className="text-sm text-slate-700">{node.label}</span>
        </div>
        {hasChildren && isOpen && (
          <div>{node.children!.map((c) => renderNode(c, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <div className={headerCls}>
          <DialogTitle className="text-[#0B6FB8] text-base font-semibold">
            Phân quyền người dùng - {groupName}
          </DialogTitle>
          <DialogClose className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></DialogClose>
        </div>
        <div className="px-6 py-4 max-h-[65vh] overflow-y-auto">
          {permTree.map((n) => renderNode(n, 0))}
        </div>
        <DialogFooter className="px-6 pb-5 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Xác nhận</Button>
          <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Assign / unassign ---------------- */

interface PersonRow { id: string; account: string; name: string; status: Status; }

const seedInGroup: PersonRow[] = [
  { id: "u1", account: "Thuna",   name: "Nguyễn Anh Thư",    status: "active" },
  { id: "u2", account: "linhnn",  name: "Nguyễn Nhật Linh",  status: "active" },
  { id: "u3", account: "hungnn",  name: "Nguyễn Như Hùng",   status: "active" },
  { id: "u4", account: "Khiemnd", name: "Nguyễn Đình Khiêm", status: "active" },
  { id: "u5", account: "kiemnh",  name: "Nông Hạnh Kiểm",    status: "active" },
  { id: "u6", account: "huongdt", name: "Đặng Thị Hương",    status: "active" },
];

const seedAvailable: PersonRow[] = [
  { id: "a1", account: "trangpt", name: "Phạm Thu Trang",    status: "active" },
  { id: "a2", account: "binhnv",  name: "Nguyễn Văn Bình",   status: "active" },
  { id: "a3", account: "dunglt",  name: "Lê Thị Dung",       status: "inactive" },
];

function AssignDialog({
  open, onOpenChange, group,
}: { open: boolean; onOpenChange: (v: boolean) => void; group: GroupRow | null }) {
  const [available, setAvailable] = useState<PersonRow[]>(seedAvailable);
  const [inGroup, setInGroup]     = useState<PersonRow[]>(seedInGroup);
  const [pickA, setPickA] = useState<Set<string>>(new Set());
  const [pickB, setPickB] = useState<Set<string>>(new Set());

  const togglePick = (setter: typeof setPickA) => (id: string) =>
    setter((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const moveToGroup = () => {
    const moving = available.filter((p) => pickA.has(p.id));
    setInGroup((g) => [...g, ...moving]);
    setAvailable((a) => a.filter((p) => !pickA.has(p.id)));
    setPickA(new Set());
  };
  const removeFromGroup = () => {
    const moving = inGroup.filter((p) => pickB.has(p.id));
    setAvailable((a) => [...a, ...moving]);
    setInGroup((g) => g.filter((p) => !pickB.has(p.id)));
    setPickB(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-5xl">
        <div className={headerCls}>
          <DialogTitle className="text-[#0B6FB8] text-base font-semibold">
            Gán nhóm NSD - {group?.name ?? ""}
          </DialogTitle>
          <DialogClose className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></DialogClose>
        </div>
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div>
            <div className="text-sm font-semibold text-slate-800 mb-3">Thông tin nhóm</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormRow label="Tên nhóm">
                <Input value={group?.name ?? ""} readOnly className="bg-slate-50" />
              </FormRow>
              <FormRow label="Loại nhóm">
                <Input value={group ? statusMeta[group.status].label : ""} readOnly className="bg-slate-50" />
              </FormRow>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-800 mb-3">Danh sách NSD</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PeoplePanel
                title="Danh sách NSD"
                rows={available}
                picked={pickA}
                onToggle={togglePick(setPickA)}
                actionLabel="Thêm vào nhóm"
                onAction={moveToGroup}
                actionDisabled={pickA.size === 0}
              />
              <PeoplePanel
                title="Danh sách NSD thuộc nhóm"
                rows={inGroup}
                picked={pickB}
                onToggle={togglePick(setPickB)}
                actionLabel="Xóa khỏi nhóm"
                onAction={removeFromGroup}
                actionDisabled={pickB.size === 0}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 pb-5">
          <Button className="bg-[#0B6FB8] hover:bg-[#095a96] text-white" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PeoplePanel({
  title, rows, picked, onToggle, actionLabel, onAction, actionDisabled,
}: {
  title: string;
  rows: PersonRow[];
  picked: Set<string>;
  onToggle: (id: string) => void;
  actionLabel: string;
  onAction: () => void;
  actionDisabled: boolean;
}) {
  const allOn = rows.length > 0 && rows.every((r) => picked.has(r.id));
  const toggleAll = () => rows.forEach((r) => {
    if (allOn && picked.has(r.id)) onToggle(r.id);
    if (!allOn && !picked.has(r.id)) onToggle(r.id);
  });
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      <div className="bg-[#EAF3FB] text-[#0B6FB8] text-sm font-semibold px-4 py-2">{title}</div>
      <div className="overflow-auto max-h-72">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-10"><Checkbox checked={allOn} onCheckedChange={toggleAll} /></TableHead>
              <TableHead className="w-12">STT</TableHead>
              <TableHead>Tài khoản</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell><Checkbox checked={picked.has(r.id)} onCheckedChange={() => onToggle(r.id)} /></TableCell>
                <TableCell className="text-slate-500">{i + 1}</TableCell>
                <TableCell className="text-slate-700">{r.account}</TableCell>
                <TableCell className="text-slate-700">{r.name}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", statusMeta[r.status].cls)}>
                    {statusMeta[r.status].label}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-sm">No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-3 border-t border-slate-100 flex justify-end">
        <Button
          disabled={actionDisabled}
          onClick={onAction}
          className="bg-[#0B6FB8] hover:bg-[#095a96] text-white"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}