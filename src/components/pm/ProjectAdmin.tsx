import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Save, Trash2, Pencil, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "search" | "create" | "view";

const projectTypes = ["Phát triển", "Bảo trì", "Nghiên cứu"];
const statusList = ["Khởi tạo", "Đang thực hiện", "Tạm dừng", "Hoàn thành", "Đóng"];

interface Member { id: number; name: string; dept: string; role: string; allocation: number; }
interface Milestone { id: number; name: string; type: string; deliveryDate: string; replanDate: string; replanCount: number; status: string; note: string; }
interface ProjectRow { id: number; code: string; name: string; type: string; openDate: string; closeDate: string; status: string; note: string; }

const sampleProjects: ProjectRow[] = [
  { id: 1, code: "PRJ-001", name: "Hệ thống ERP nội bộ", type: "Phát triển", openDate: "2025-01-10", closeDate: "2025-12-30", status: "Đang thực hiện", note: "Triển khai phân hệ HR" },
  { id: 2, code: "PRJ-002", name: "Bảo trì Cổng TT", type: "Bảo trì", openDate: "2025-03-01", closeDate: "2026-03-01", status: "Đang thực hiện", note: "Hợp đồng năm" },
  { id: 3, code: "PRJ-003", name: "Nghiên cứu AI Agent", type: "Nghiên cứu", openDate: "2025-05-15", closeDate: "", status: "Khởi tạo", note: "PoC giai đoạn 1" },
];

export function ProjectAdmin() {
  const [mode, setMode] = useState<Mode>("search");
  const [activeTab, setActiveTab] = useState<"general" | "replan" | "members" | "milestones">("general");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // search filters
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  // members
  const [members, setMembers] = useState<Member[]>([]);
  const [mForm, setMForm] = useState<Member>({ id: 0, name: "", dept: "", role: "", allocation: 100 });

  // milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [msForm, setMsForm] = useState<Milestone>({ id: 0, name: "", type: "", deliveryDate: "", replanDate: "", replanCount: 0, status: "", note: "" });

  // project list datagrid
  const [projects, setProjects] = useState<ProjectRow[]>(sampleProjects);

  const removeProject = (id: number) => setProjects(projects.filter(p => p.id !== id));

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleSelectAll = () => {
    if (selectedIds.length === projects.length) setSelectedIds([]);
    else setSelectedIds(projects.map((p) => p.id));
  };

  const viewProjectRow = (p: ProjectRow) => {
    setMode("view");
    setActiveTab("general");
    setCode(p.code);
    setName(p.name);
    setType(p.type);
  };

  const switchMode = (m: Mode) => { setMode(m); setActiveTab("general"); };

  const tabs = mode === "search"
    ? [{ k: "general", l: "Thông tin chung" }]
    : [
        { k: "general", l: "Thông tin chung" },
        { k: "replan", l: "Replan" },
        { k: "members", l: "Nhân sự dự án" },
        { k: "milestones", l: "Milestone dự án" },
      ];

  const readOnly = mode === "view";

  const addMember = () => {
    if (!mForm.name.trim()) return;
    setMembers([...members, { ...mForm, id: Date.now() }]);
    setMForm({ id: 0, name: "", dept: "", role: "", allocation: 100 });
  };
  const removeMember = (id: number) => setMembers(members.filter(x => x.id !== id));

  const addMilestone = () => {
    if (!msForm.name.trim()) return;
    setMilestones([...milestones, { ...msForm, id: Date.now() }]);
    setMsForm({ id: 0, name: "", type: "", deliveryDate: "", replanDate: "", replanCount: 0, status: "", note: "" });
  };
  const removeMilestone = (id: number) => setMilestones(milestones.filter(x => x.id !== id));

  const toolbarBtn = (icon: any, label: string, onClick: () => void, active = false, variant: "default" | "danger" = "default") => {
    const Icon = icon;
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium border transition-all shadow-sm active:scale-95",
          active
            ? "bg-[#FE9D58] text-white border-[#FE9D58] shadow-md"
            : variant === "danger"
              ? "bg-white text-red-600 border-red-200 hover:bg-red-50"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        )}
      >
        <Icon className="h-3.5 w-3.5" /> {label}
      </button>
    );
  };

  return (
    <div className="px-6 lg:px-10 py-8 space-y-5">
      {/* Title + Toolbar */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white border border-orange-100 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F2937]">Danh sách dự án</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Quản trị thông tin dự án — tìm kiếm, thêm mới, cập nhật và xóa.</p>
          </div>
          <div className="flex items-center gap-2">
            {toolbarBtn(Plus, "Thêm mới", () => switchMode("create"), mode === "create")}
            {toolbarBtn(Search, "Tìm kiếm", () => switchMode("search"), mode === "search")}
            {toolbarBtn(Save, "Lưu", () => {})}
            {toolbarBtn(Trash2, "Xóa", () => {}, false, "danger")}
          </div>
        </div>
        {mode === "view" && (
          <div className="mt-3 text-xs px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 inline-flex items-center gap-2">
            <Eye className="h-3.5 w-3.5" /> Đang ở chế độ xem chi tiết — chỉ đọc. Bấm "Tìm kiếm" hoặc "Thêm mới" để thoát.
          </div>
        )}
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl bg-white border border-orange-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Mã dự án">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: PRJ-001" className="h-9" disabled={readOnly} />
          </Field>
          <Field label="Tên dự án">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên dự án" className="h-9" disabled={readOnly} />
          </Field>
          <Field label="Loại dự án">
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60" disabled={readOnly}>
              <option value="">-- Tất cả --</option>
              {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <div className="flex items-end">
            <Button className="h-9 w-full bg-[#FE9D58] hover:bg-[#ea580c] text-white shadow-md" disabled={readOnly}>
              <Search className="h-4 w-4 mr-1.5" /> Tìm kiếm
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs + Content */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white border border-orange-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-5 flex items-center gap-1">
          {tabs.map(t => {
            const active = activeTab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k as any)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
                  active ? "text-[#0c4a6e]" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {t.l}
                {active && <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-[#0c4a6e] rounded-full" />}
              </button>
            );
          })}
        </div>

        <fieldset disabled={readOnly} className={cn("p-6", readOnly && "opacity-90")}>
          {activeTab === "general" && <GeneralTab mode={mode} />}
          {activeTab === "replan" && <ReplanTab />}
          {activeTab === "members" && (
            <MembersTab form={mForm} setForm={setMForm} members={members} onAdd={addMember} onRemove={removeMember} />
          )}
          {activeTab === "milestones" && (
            <MilestonesTab form={msForm} setForm={setMsForm} milestones={milestones} onAdd={addMilestone} onRemove={removeMilestone} />
          )}
        </fieldset>
      </motion.div>

      {/* Project list datagrid */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl bg-white border border-orange-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-[#1F2937]">Danh sách bản ghi</h3>
          <span className="text-xs text-muted-foreground">Kết quả tìm kiếm / thêm mới</span>
        </div>
        <DataGrid
          headers={[
            <input
              key="sel-all"
              type="checkbox"
              checked={projects.length > 0 && selectedIds.length === projects.length}
              onChange={toggleSelectAll}
              className="h-3.5 w-3.5 cursor-pointer accent-[#FE9D58]"
            />,
            "STT",
            "Mã dự án", "Tên dự án", "Loại dự án", "Ngày mở dự án", "Ngày đóng dự án", "Trạng thái", "Diễn giải", "Chức năng",
          ]}
          rows={projects}
          renderRow={(p: ProjectRow, i: number) => (
            <>
              <td className="px-4 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#FE9D58]"
                />
              </td>
              <td className="px-4 py-2.5 text-sm">{i + 1}</td>
              <td className="px-4 py-2.5 text-sm font-mono">{p.code}</td>
              <td className="px-4 py-2.5 text-sm font-medium">{p.name}</td>
              <td className="px-4 py-2.5 text-sm">{p.type}</td>
              <td className="px-4 py-2.5 text-sm font-mono">{p.openDate}</td>
              <td className="px-4 py-2.5 text-sm font-mono">{p.closeDate || "-"}</td>
              <td className="px-4 py-2.5 text-sm">{p.status}</td>
              <td className="px-4 py-2.5 text-sm text-muted-foreground max-w-[220px] truncate" title={p.note}>{p.note}</td>
              <td className="px-4 py-2.5 text-sm">
                <RowActions
                  onView={() => viewProjectRow(p)}
                  onDelete={() => removeProject(p.id)}
                />
              </td>
            </>
          )}
          emptyText="Chưa có bản ghi nào."
        />
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-600">{label}</Label>
      {children}
    </div>
  );
}

function GeneralTab({ mode }: { mode: Mode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Field label="Ngày mở dự án"><Input type="date" className="h-9" /></Field>
      <Field label="Ngày đóng dự án"><Input type="date" className="h-9" /></Field>
      <Field label="Trạng thái">
        <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option value="">-- Chọn --</option>
          {statusList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <div className="md:col-span-2 xl:col-span-3">
        <Field label="Diễn giải">
          <textarea rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-9" placeholder="Nhập diễn giải..." />
        </Field>
      </div>
    </div>
  );
}

function ReplanTab() {
  const [rpMode, setRpMode] = useState<"update" | "replan">("update");
  const planDisabled = rpMode === "update";
  const actualDisabled = rpMode === "replan";

  const history = [
    { id: 1, code: "PRJ-001", name: "Hệ thống ERP nội bộ", type: "Phát triển", field: "Ngày kết thúc - KH", action: "Replan", oldVal: "2025-11-30", newVal: "2025-12-30", reason: "Bổ sung phạm vi phân hệ HR", date: "2025-10-05", user: "nguyen.van.a" },
    { id: 2, code: "PRJ-001", name: "Hệ thống ERP nội bộ", type: "Phát triển", field: "Tiến độ - TT (%)", action: "Update", oldVal: "45", newVal: "60", reason: "Cập nhật tiến độ tuần 40", date: "2025-10-08", user: "tran.thi.b" },
    { id: 3, code: "PRJ-002", name: "Bảo trì Cổng TT", type: "Bảo trì", field: "Ngân sách - KH", action: "Replan", oldVal: "500,000,000", newVal: "620,000,000", reason: "Điều chỉnh hợp đồng phụ lục 01", date: "2025-09-20", user: "le.van.c" },
    { id: 4, code: "PRJ-002", name: "Bảo trì Cổng TT", type: "Bảo trì", field: "Nguồn lực - TT", action: "Update", oldVal: "3", newVal: "4", reason: "Bổ sung 1 nhân sự QA", date: "2025-10-01", user: "pham.d" },
    { id: 5, code: "PRJ-003", name: "Nghiên cứu AI Agent", type: "Nghiên cứu", field: "Ngày bắt đầu - KH", action: "Replan", oldVal: "2025-05-15", newVal: "2025-06-01", reason: "Chờ phê duyệt PoC", date: "2025-05-10", user: "hoang.e" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 mr-1">Chế độ:</span>
        <button
          onClick={() => setRpMode("update")}
          className={cn(
            "h-9 px-4 rounded-lg text-xs font-medium border transition-all shadow-sm",
            rpMode === "update" ? "bg-[#FE9D58] text-white border-[#FE9D58]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          )}
        >
          Update (Thực tế)
        </button>
        <button
          onClick={() => setRpMode("replan")}
          className={cn(
            "h-9 px-4 rounded-lg text-xs font-medium border transition-all shadow-sm",
            rpMode === "replan" ? "bg-[#FE9D58] text-white border-[#FE9D58]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          )}
        >
          Replan (Kế hoạch)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Field label="Ngày bắt đầu - Kế hoạch"><Input type="date" className="h-9" disabled={planDisabled} /></Field>
        <Field label="Ngày bắt đầu - Thực tế"><Input type="date" className="h-9" disabled={actualDisabled} /></Field>
        <div className="hidden xl:block" />

        <Field label="Ngày kết thúc - Kế hoạch"><Input type="date" className="h-9" disabled={planDisabled} /></Field>
        <Field label="Ngày kết thúc - Thực tế"><Input type="date" className="h-9" disabled={actualDisabled} /></Field>
        <div className="hidden xl:block" />

        <Field label="Tiến độ - Kế hoạch (%)"><Input type="number" className="h-9" disabled={planDisabled} /></Field>
        <Field label="Tiến độ - Thực tế (%)"><Input type="number" className="h-9" disabled={actualDisabled} /></Field>
        <div className="hidden xl:block" />

        <Field label="Nguồn lực - Kế hoạch"><Input type="number" className="h-9" disabled={planDisabled} /></Field>
        <Field label="Nguồn lực - Thực tế"><Input type="number" className="h-9" disabled={actualDisabled} /></Field>
        <div className="hidden xl:block" />

        <Field label="Ngân sách - Kế hoạch"><Input type="number" className="h-9" disabled={planDisabled} /></Field>
        <Field label="Ngân sách - Thực tế"><Input type="number" className="h-9" disabled={actualDisabled} /></Field>
        <Field label="Tổng số bug chưa xử lý"><Input type="number" className="h-9" /></Field>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display text-sm font-semibold text-[#1F2937]">Lịch sử Replan / Update</h4>
          <span className="text-xs text-muted-foreground">Danh sách các thông tin được thay đổi</span>
        </div>
        <DataGrid
          headers={["STT", "Mã dự án", "Tên dự án", "Loại dự án", "Nội dung thay đổi", "Thao tác", "Giá trị cũ", "Giá trị mới", "Lý do", "Ngày thay đổi", "Người thay đổi"]}
          rows={history}
          renderRow={(r: any, i: number) => (
            <>
              <td className="px-4 py-2.5 text-sm">{i + 1}</td>
              <td className="px-4 py-2.5 text-sm font-mono">{r.code}</td>
              <td className="px-4 py-2.5 text-sm font-medium">{r.name}</td>
              <td className="px-4 py-2.5 text-sm">{r.type}</td>
              <td className="px-4 py-2.5 text-sm">{r.field}</td>
              <td className="px-4 py-2.5 text-sm">
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
                  r.action === "Replan" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"
                )}>{r.action}</span>
              </td>
              <td className="px-4 py-2.5 text-sm font-mono text-red-600">{r.oldVal}</td>
              <td className="px-4 py-2.5 text-sm font-mono text-emerald-600">{r.newVal}</td>
              <td className="px-4 py-2.5 text-sm text-muted-foreground max-w-[220px] truncate" title={r.reason}>{r.reason}</td>
              <td className="px-4 py-2.5 text-sm font-mono">{r.date}</td>
              <td className="px-4 py-2.5 text-sm">{r.user}</td>
            </>
          )}
          emptyText="Chưa có lịch sử thay đổi."
        />
      </div>
    </div>
  );
}

function MembersTab({ form, setForm, members, onAdd, onRemove }: any) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Field label="Tên nhân sự"><Input value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} className="h-9" /></Field>
        <Field label="Phòng ban"><Input value={form.dept} onChange={(e: any) => setForm({ ...form, dept: e.target.value })} className="h-9" /></Field>
        <Field label="Chức vụ"><Input value={form.role} onChange={(e: any) => setForm({ ...form, role: e.target.value })} className="h-9" /></Field>
        <Field label="% Phân bổ"><Input type="number" value={form.allocation} onChange={(e: any) => setForm({ ...form, allocation: +e.target.value })} className="h-9" /></Field>
      </div>
      <div className="flex justify-end">
        <Button onClick={onAdd} className="h-9 bg-[#FE9D58] hover:bg-[#ea580c] text-white shadow-md">
          <Plus className="h-4 w-4 mr-1.5" /> Thêm
        </Button>
      </div>
      <DataGrid
        headers={["STT", "Tên nhân sự", "Phòng ban", "Chức vụ", "% Phân bổ", "Chức năng"]}
        rows={members}
        renderRow={(m: Member, i: number) => (
          <>
            <td className="px-4 py-2.5 text-sm">{i + 1}</td>
            <td className="px-4 py-2.5 text-sm font-medium">{m.name}</td>
            <td className="px-4 py-2.5 text-sm">{m.dept}</td>
            <td className="px-4 py-2.5 text-sm">{m.role}</td>
            <td className="px-4 py-2.5 text-sm font-mono">{m.allocation}%</td>
            <td className="px-4 py-2.5 text-sm">
              <RowActions onDelete={() => onRemove(m.id)} />
            </td>
          </>
        )}
        emptyText="Chưa có nhân sự. Nhập thông tin và bấm Thêm."
      />
    </div>
  );
}

function MilestonesTab({ form, setForm, milestones, onAdd, onRemove }: any) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Tên Milestone"><Input value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} className="h-9" /></Field>
        <Field label="Loại Milestone">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">-- Chọn --</option>
            <option>Phân tích</option><option>Thiết kế</option><option>Phát triển</option><option>Kiểm thử</option><option>Bàn giao</option>
          </select>
        </Field>
        <Field label="Ngày bàn giao"><Input type="date" value={form.deliveryDate} onChange={(e: any) => setForm({ ...form, deliveryDate: e.target.value })} className="h-9" /></Field>
        <Field label="Ngày replan"><Input type="date" value={form.replanDate} onChange={(e: any) => setForm({ ...form, replanDate: e.target.value })} className="h-9" /></Field>
        <Field label="Số lần replan"><Input type="number" value={form.replanCount} onChange={(e: any) => setForm({ ...form, replanCount: +e.target.value })} className="h-9" /></Field>
        <Field label="Trạng thái">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">-- Chọn --</option>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <div className="md:col-span-3">
          <Field label="Ghi chú">
            <Input value={form.note} onChange={(e: any) => setForm({ ...form, note: e.target.value })} className="h-9" />
          </Field>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onAdd} className="h-9 bg-[#FE9D58] hover:bg-[#ea580c] text-white shadow-md">
          <Plus className="h-4 w-4 mr-1.5" /> Thêm
        </Button>
      </div>
      <DataGrid
        headers={["STT", "Tên Milestone", "Loại", "Ngày bàn giao", "Ngày replan", "Số lần replan", "Trạng thái", "Ghi chú", "Chức năng"]}
        rows={milestones}
        renderRow={(m: Milestone, i: number) => (
          <>
            <td className="px-4 py-2.5 text-sm">{i + 1}</td>
            <td className="px-4 py-2.5 text-sm font-medium">{m.name}</td>
            <td className="px-4 py-2.5 text-sm">{m.type}</td>
            <td className="px-4 py-2.5 text-sm font-mono">{m.deliveryDate}</td>
            <td className="px-4 py-2.5 text-sm font-mono">{m.replanDate}</td>
            <td className="px-4 py-2.5 text-sm font-mono">{m.replanCount}</td>
            <td className="px-4 py-2.5 text-sm">{m.status}</td>
            <td className="px-4 py-2.5 text-sm text-muted-foreground">{m.note}</td>
            <td className="px-4 py-2.5 text-sm">
              <RowActions onDelete={() => onRemove(m.id)} />
            </td>
          </>
        )}
        emptyText="Chưa có Milestone. Nhập thông tin và bấm Thêm."
      />
    </div>
  );
}

function RowActions({ onDelete, onView }: { onDelete: () => void; onView?: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors" title="Chỉnh sửa">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors" title="Xóa">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      {onView && (
        <button onClick={onView} className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors" title="Xem chi tiết">
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function DataGrid({ headers, rows, renderRow, emptyText }: { headers: React.ReactNode[]; rows: any[]; renderRow: (r: any, i: number) => React.ReactNode; emptyText: string }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const shown = total === 0 ? 0 : Math.min(pageSize, total - (page - 1) * pageSize);
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {visible.length === 0 ? (
            <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-sm text-muted-foreground">{emptyText}</td></tr>
          ) : (
            visible.map((r, i) => (
              <tr key={r.id ?? i} className="hover:bg-gray-50/60 transition-colors">{renderRow(r, (page - 1) * pageSize + i)}</tr>
            ))
          )}
          <tr className="bg-gray-50/60 border-t">
            <td colSpan={headers.length} className="px-4 py-2.5">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{shown} / {total} bản ghi</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 rounded hover:bg-white disabled:opacity-40">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={cn("min-w-[24px] px-1.5 h-6 rounded text-[11px] font-medium", page === p ? "bg-[#FE9D58] text-white" : "hover:bg-white")}>
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-1">…</span>}
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1 rounded hover:bg-white disabled:opacity-40">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
