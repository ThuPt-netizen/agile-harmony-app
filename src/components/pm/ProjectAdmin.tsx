import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Save, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "search" | "create";

const projectTypes = ["Phát triển", "Bảo trì", "Nghiên cứu"];
const statusList = ["Khởi tạo", "Đang thực hiện", "Tạm dừng", "Hoàn thành", "Đóng"];

interface Member { id: number; name: string; dept: string; role: string; allocation: number; }
interface Milestone { id: number; name: string; type: string; deliveryDate: string; replanDate: string; replanCount: number; status: string; note: string; }

export function ProjectAdmin() {
  const [mode, setMode] = useState<Mode>("search");
  const [activeTab, setActiveTab] = useState<"general" | "members" | "milestones">("general");

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

  const switchMode = (m: Mode) => { setMode(m); setActiveTab("general"); };

  const tabs = mode === "create"
    ? [{ k: "general", l: "Thông tin chung" }, { k: "members", l: "Nhân sự dự án" }, { k: "milestones", l: "Milestone dự án" }]
    : [{ k: "general", l: "Thông tin chung" }];

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
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl bg-white border border-orange-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Mã dự án">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: PRJ-001" className="h-9" />
          </Field>
          <Field label="Tên dự án">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên dự án" className="h-9" />
          </Field>
          <Field label="Loại dự án">
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="">-- Tất cả --</option>
              {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <div className="flex items-end">
            <Button className="h-9 w-full bg-[#FE9D58] hover:bg-[#ea580c] text-white shadow-md">
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

        <div className="p-6">
          {activeTab === "general" && <GeneralTab mode={mode} />}
          {activeTab === "members" && (
            <MembersTab form={mForm} setForm={setMForm} members={members} onAdd={addMember} onRemove={removeMember} />
          )}
          {activeTab === "milestones" && (
            <MilestonesTab form={msForm} setForm={setMsForm} milestones={milestones} onAdd={addMilestone} onRemove={removeMilestone} />
          )}
        </div>
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
  const fields: { l: string; t?: string }[] = [
    { l: "Ngày bắt đầu - Kế hoạch", t: "date" },
    { l: "Ngày kết thúc - Kế hoạch", t: "date" },
    { l: "Ngày bắt đầu - Thực tế", t: "date" },
    { l: "Ngày kết thúc - Thực tế", t: "date" },
    { l: "Ngân sách - Kế hoạch", t: "number" },
    { l: "Ngân sách - Thực tế", t: "number" },
    { l: "Tiến độ - Kế hoạch (%)", t: "number" },
    { l: "Tiến độ - Thực tế (%)", t: "number" },
    { l: "Nguồn lực - Kế hoạch", t: "number" },
    { l: "Nguồn lực - Thực tế", t: "number" },
    ...(mode === "create" ? [{ l: "Tổng số bug chưa xử lý", t: "number" }] : []),
    { l: "Ngày mở dự án", t: "date" },
    { l: "Ngày đóng dự án", t: "date" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fields.map((f) => (
          <Field key={f.l} label={f.l}>
            <Input type={f.t || "text"} className="h-9" />
          </Field>
        ))}
        <Field label="Trạng thái">
          <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">-- Chọn --</option>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Diễn giải">
        <textarea rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Nhập diễn giải..." />
      </Field>
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

function RowActions({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors" title="Chỉnh sửa">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors" title="Xóa">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function DataGrid({ headers, rows, renderRow, emptyText }: { headers: string[]; rows: any[]; renderRow: (r: any, i: number) => React.ReactNode; emptyText: string }) {
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
            {headers.map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600">{h}</th>
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
