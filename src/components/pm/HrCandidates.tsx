import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  UserPlus2,
  Trash2,
  Plus,
  Search,
  Calendar,
  Paperclip,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  applyDate: string;
  interviewDate: string;
  school: string;
  major: string;
  status: string;
  iqScore: string;
  iqStatus: string;
  proScore: string;
  proStatus: string;
}

const seed: Candidate[] = [
  {
    id: "C001",
    name: "Vương Thùy Nguyên",
    email: "vuongthuynguyen0@gmail.com",
    phone: "0966509284",
    position: "Tester",
    experience: "7 tháng",
    applyDate: "",
    interviewDate: "13/11/2023",
    school: "Đại học Công nghệ Giao Thông vận tải",
    major: "Công nghệ thông tin",
    status: "Từ chối",
    iqScore: "75",
    iqStatus: "Không đạt",
    proScore: "65",
    proStatus: "Không đạt",
  },
  {
    id: "C002",
    name: "Phạm Thị Thảo",
    email: "phamthaohust@gmail.com",
    phone: "0355678384",
    position: "Tester",
    experience: "10 tháng",
    applyDate: "",
    interviewDate: "13/11/2023",
    school: "Đại học Bách Khoa Hà Nội",
    major: "Kỹ Thuật phần mềm",
    status: "Đạt",
    iqScore: "85",
    iqStatus: "Đạt",
    proScore: "82",
    proStatus: "Đạt",
  },
  {
    id: "C003",
    name: "Lê Thị Phương",
    email: "phuongthuyk00@gmail.com",
    phone: "0376448027",
    position: "Tester",
    experience: "1 năm",
    applyDate: "",
    interviewDate: "13/11/2023",
    school: "Học viện Nông Nghiệp Việt Nam",
    major: "Công Nghệ thông tin",
    status: "Chờ phỏng vấn",
    iqScore: "—",
    iqStatus: "—",
    proScore: "—",
    proStatus: "—",
  },
];

const statusColor: Record<string, string> = {
  "Đạt": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Từ chối": "bg-rose-50 text-rose-700 ring-rose-200",
  "Chờ phỏng vấn": "bg-amber-50 text-amber-700 ring-amber-200",
};

function ActionBtn({
  icon,
  label,
  disabled,
  onClick,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  tone?: "default" | "danger" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
        disabled
          ? "text-slate-300 border-slate-200 cursor-not-allowed bg-white"
          : tone === "danger"
          ? "text-rose-600 border-rose-200 hover:bg-rose-50 bg-white"
          : tone === "primary"
          ? "text-white bg-gradient-to-r from-orange-500 to-rose-500 border-transparent hover:brightness-110 shadow-sm shadow-orange-500/30"
          : "text-slate-700 border-slate-200 hover:bg-slate-50 bg-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function HrCandidates() {
  const [rows, setRows] = useState<Candidate[]>(seed);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [posFilter, setPosFilter] = useState<string>("all");

  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [activeRow, setActiveRow] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        (!query || r.name.toLowerCase().includes(query.toLowerCase())) &&
        (posFilter === "all" || r.position === posFilter)
    );
  }, [rows, query, posFilter]);

  const allChecked = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const someChecked = selected.size > 0;
  const onlyOne = selected.size === 1;

  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) {
      filtered.forEach((r) => next.delete(r.id));
    } else {
      filtered.forEach((r) => next.add(r.id));
    }
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const getSelectedRow = () => rows.find((r) => selected.has(r.id)) ?? null;

  const handleDelete = () => {
    setRows((rs) => rs.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    setOpenDelete(false);
  };

  return (
    <div className="px-6 lg:px-10 py-6 bg-slate-200 min-h-full">
      {/* Header card */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Title + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-sky-700">Danh sách ứng viên</h2>
          <div className="flex flex-wrap items-center gap-2">
            <ActionBtn
              icon={<Eye className="h-4 w-4" />}
              label="Chi tiết"
              disabled={!onlyOne}
              onClick={() => {
                setActiveRow(getSelectedRow());
                setOpenDetail(true);
              }}
            />
            <ActionBtn
              icon={<Pencil className="h-4 w-4" />}
              label="Cập nhật"
              disabled={!onlyOne}
              onClick={() => {
                setActiveRow(getSelectedRow());
                setOpenEdit(true);
              }}
            />
            <ActionBtn
              icon={<UserPlus2 className="h-4 w-4" />}
              label="Chuyển nhân sự"
              disabled={!onlyOne}
              onClick={() => {
                setActiveRow(getSelectedRow());
                setOpenTransfer(true);
              }}
            />
            <ActionBtn
              icon={<Trash2 className="h-4 w-4" />}
              label="Xóa"
              tone="danger"
              disabled={!someChecked}
              onClick={() => setOpenDelete(true)}
            />
            <ActionBtn
              icon={<Plus className="h-4 w-4" />}
              label="Thêm"
              tone="primary"
              disabled={someChecked}
              onClick={() => setOpenAdd(true)}
            />
          </div>
        </div>

        {/* Filter */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Switch checked={advanced} onCheckedChange={setAdvanced} />
            <span className="text-sm text-slate-600">Tìm kiếm nâng cao</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Họ và tên</Label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Họ và tên"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Vị trí ứng tuyển</Label>
              <Select value={posFilter} onValueChange={setPosFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Vị trí ứng tuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Tester">Tester</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="BA">BA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Ngày ứng tuyển</Label>
              <div className="flex items-center gap-1">
                <Input type="date" className="h-9" />
                <span className="text-slate-400">→</span>
                <Input type="date" className="h-9" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Ngày phỏng vấn</Label>
              <div className="flex items-center gap-1">
                <Input type="date" className="h-9" />
                <span className="text-slate-400">→</span>
                <Input type="date" className="h-9" />
              </div>
            </div>
            <Button className="h-9 bg-sky-600 hover:bg-sky-700 text-white">
              <Search className="h-4 w-4 mr-1" /> Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 w-10">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
                </th>
                <th className="px-3 py-2 text-left font-medium">Họ và tên</th>
                <th className="px-3 py-2 text-left font-medium">Email cá nhân</th>
                <th className="px-3 py-2 text-left font-medium">Số điện thoại</th>
                <th className="px-3 py-2 text-left font-medium">Vị trí ứng tuyển</th>
                <th className="px-3 py-2 text-left font-medium">Kinh nghiệm</th>
                <th className="px-3 py-2 text-left font-medium">Ngày ứng tuyển</th>
                <th className="px-3 py-2 text-left font-medium">Ngày phỏng vấn</th>
                <th className="px-3 py-2 text-left font-medium">Trường học</th>
                <th className="px-3 py-2 text-left font-medium">Ngành học</th>
                <th className="px-3 py-2 text-left font-medium">Trạng thái</th>
                <th className="px-3 py-2 text-left font-medium">Điểm test IQ</th>
                <th className="px-3 py-2 text-left font-medium">Trạng thái test IQ</th>
                <th className="px-3 py-2 text-left font-medium">Điểm test chuyên môn</th>
                <th className="px-3 py-2 text-left font-medium">Trạng thái test chuyên môn</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selected.has(r.id)}
                      onCheckedChange={() => toggleOne(r.id)}
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-800 font-medium">{r.name}</td>
                  <td className="px-3 py-2 text-slate-600">{r.email}</td>
                  <td className="px-3 py-2 text-slate-600">{r.phone}</td>
                  <td className="px-3 py-2 text-slate-600">{r.position}</td>
                  <td className="px-3 py-2 text-slate-600">{r.experience}</td>
                  <td className="px-3 py-2 text-slate-600">{r.applyDate || "—"}</td>
                  <td className="px-3 py-2 text-slate-600">{r.interviewDate}</td>
                  <td className="px-3 py-2 text-slate-600">{r.school}</td>
                  <td className="px-3 py-2 text-slate-600">{r.major}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs ring-1",
                        statusColor[r.status] ?? "bg-slate-50 text-slate-600 ring-slate-200"
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{r.iqScore}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs ring-1",
                        r.iqStatus === "Đạt"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : r.iqStatus === "Không đạt"
                          ? "bg-rose-50 text-rose-700 ring-rose-200"
                          : "bg-slate-50 text-slate-600 ring-slate-200"
                      )}
                    >
                      {r.iqStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{r.proScore}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs ring-1",
                        r.proStatus === "Đạt"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : r.proStatus === "Không đạt"
                          ? "bg-rose-50 text-rose-700 ring-rose-200"
                          : "bg-slate-50 text-slate-600 ring-slate-200"
                      )}
                    >
                      {r.proStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={15} className="text-center py-10 text-slate-400">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="h-7 rounded border border-slate-200 px-1">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span>/{filtered.length} bản ghi</span>
            <button className="ml-2 text-slate-500 hover:text-slate-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-slate-100"><ChevronsLeft className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-slate-100"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-2 py-0.5 rounded bg-sky-600 text-white">1</button>
            <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-slate-100"><ChevronsRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Add / Edit dialog */}
      <CandidateFormDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Thêm thông tin ứng viên"
        candidate={null}
      />
      <CandidateFormDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title={`Sửa thông tin ứng viên - ${activeRow?.name ?? ""}`}
        candidate={activeRow}
      />

      {/* Detail dialog */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sky-700">
              Xem thông tin ứng viên - {activeRow?.name}
            </DialogTitle>
          </DialogHeader>
          {activeRow && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Field label="Họ và tên" value={activeRow.name} />
              <Field label="Email cá nhân" value={activeRow.email} />
              <Field label="Số điện thoại" value={activeRow.phone} />
              <Field label="Vị trí ứng tuyển" value={activeRow.position} />
              <Field label="Kinh nghiệm" value={activeRow.experience} />
              <Field label="Ngày ứng tuyển" value={activeRow.applyDate || "—"} />
              <Field label="Ngày phỏng vấn" value={activeRow.interviewDate} />
              <Field label="Trường học" value={activeRow.school} />
              <Field label="Ngành học" value={activeRow.major} />
              <Field label="Trạng thái" value={activeRow.status} />
              <div className="col-span-2 mt-3 pt-3 border-t border-slate-100">
                <div className="text-sm font-semibold text-slate-700 mb-2">Kết quả test IQ</div>
                <Field label="Điểm" value="0" />
                <Field label="Kết quả kiểm tra" value="—" />
                <Field label="Đánh giá chung" value="—" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDetail(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer dialog */}
      <Dialog open={openTransfer} onOpenChange={setOpenTransfer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sky-700">
              Chuyển lên nhân sự - {activeRow?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <FieldInput label="Họ và tên" defaultValue={activeRow?.name} />
            <FieldInput label="Email công việc" placeholder="name@navisoft.vn" />
            <FieldInput label="Số điện thoại" defaultValue={activeRow?.phone} />
            <FieldInput label="Vị trí" defaultValue={activeRow?.position} />
            <FieldInput label="Ngày bắt đầu" type="date" />
            <FieldInput label="Loại hợp đồng" placeholder="Thử việc/Chính thức" />
          </div>
          <DialogFooter>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={() => setOpenTransfer(false)}>
              Xác nhận
            </Button>
            <Button variant="outline" onClick={() => setOpenTransfer(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-slate-600">
            Bạn có chắc chắn muốn xóa {selected.size} bản ghi ứng viên đã chọn?
            <ul className="mt-2 list-disc list-inside text-slate-700">
              {rows.filter((r) => selected.has(r.id)).map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-slate-800">{value}</div>
    </div>
  );
}

function FieldInput({
  label,
  required,
  ...rest
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <Label className={cn("text-xs", required ? "text-rose-600" : "text-slate-600")}>
        {label}
        {required && " *"}
      </Label>
      <Input className="h-9" {...rest} />
    </div>
  );
}

function CandidateFormDialog({
  open,
  onClose,
  title,
  candidate,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  candidate: Candidate | null;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sky-700">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          <FieldInput label="Họ và tên" required defaultValue={candidate?.name} />
          <FieldInput label="Email cá nhân" required defaultValue={candidate?.email} />
          <FieldInput label="Số điện thoại" required defaultValue={candidate?.phone} />
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Vị trí ứng tuyển</Label>
            <Select defaultValue={candidate?.position}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Chọn vị trí" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tester">Tester</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="BA">BA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FieldInput label="Kinh nghiệm" required defaultValue={candidate?.experience} />
          <FieldInput label="Ngày ứng tuyển" type="date" required />
          <FieldInput label="Ngày phỏng vấn" type="date" defaultValue={candidate?.interviewDate} />
          <FieldInput label="Trường học" defaultValue={candidate?.school} />
          <FieldInput label="Ngành học" defaultValue={candidate?.major} />
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Trạng thái</Label>
            <Select defaultValue={candidate?.status}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Chờ phỏng vấn">Chờ phỏng vấn</SelectItem>
                <SelectItem value="Đạt">Đạt</SelectItem>
                <SelectItem value="Từ chối">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-xs text-rose-600">Hồ sơ xin việc *</Label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-md h-9 px-3">
              <Paperclip className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400 flex-1 truncate">Chưa chọn tệp</span>
              <Button size="sm" variant="outline" className="h-7">Chọn tệp</Button>
            </div>
          </div>

          <div className="col-span-2 mt-2 pt-3 border-t border-slate-100">
            <div className="text-sm font-medium text-slate-700 mb-2">Kết quả test chuyên môn</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              <FieldInput label="Điểm" required defaultValue="0" />
              <div className="space-y-1">
                <Label className="text-xs text-rose-600">Kết quả kiểm tra *</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Chọn" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pass">Đạt</SelectItem>
                    <SelectItem value="fail">Không đạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <FieldInput label="Đánh giá chung" />
              </div>
            </div>
          </div>

          <div className="col-span-2 mt-2 pt-3 border-t border-slate-100">
            <div className="text-sm font-medium text-slate-700 mb-2">Kết quả test IQ</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              <FieldInput label="Điểm" required defaultValue="0" />
              <div className="space-y-1">
                <Label className="text-xs text-rose-600">Kết quả kiểm tra *</Label>
                <Select>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Chọn" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pass">Đạt</SelectItem>
                    <SelectItem value="fail">Không đạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <FieldInput label="Đánh giá chung" />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={onClose}>Xác nhận</Button>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}