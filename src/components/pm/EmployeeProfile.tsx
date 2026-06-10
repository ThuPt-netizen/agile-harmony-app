import { ChevronLeft, Mail, Phone, IdCard, Briefcase, Wallet, AlertTriangle, Trophy, FileText, ClipboardCheck, Database, FileIcon, Pencil, Plus, Info, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { key: "personal", label: "Thông tin cá nhân", desc: "Thông tin cá nhân, lý lịch và pháp lý", icon: IdCard },
  { key: "work", label: "Thông tin công việc", desc: "Công việc, sự nghiệp, tuyển dụng, các...", icon: Briefcase },
  { key: "salary", label: "Lương & phúc lợi", desc: "Bảng lương và phúc lợi", icon: Wallet },
  { key: "violation", label: "Vi phạm", desc: "Các vi phạm quy định làm việc, chính ...", icon: AlertTriangle },
  { key: "award", label: "Thành tựu và giải thưởng", desc: "Giải thưởng, chứng chỉ, cột mốc và sự ...", icon: Trophy },
  { key: "contract", label: "Hợp đồng & văn bản", desc: "Hợp đồng, lịch sử hợp đồng và văn b...", icon: FileText },
  { key: "review", label: "Đánh giá nhân sự", desc: "Quản lí hiệu suất và phản hồi", icon: ClipboardCheck },
  { key: "mei", label: "Thông tin MEI", desc: "Thông tin về mei theo dự án", icon: Database },
];

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[12px] text-gray-500">{label}</div>
      <div className="text-[13px] font-semibold text-gray-900">{value || "—"}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
      <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
    </div>
  );
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-blue-50/60 text-gray-700">
        {cols.map((c, i) => (
          <th key={i} className="text-left font-semibold px-3 py-2 border-l-2 border-white text-[13px]">{c}</th>
        ))}
      </tr>
    </thead>
  );
}

function EmptyRow({ span }: { span: number }) {
  return (
    <tr>
      <td colSpan={span} className="px-3 py-5 text-center">
        <span className="inline-block px-3 py-1.5 text-[12px] text-gray-500 bg-gray-50 border border-gray-200 rounded-md">Không có dữ liệu</span>
      </td>
    </tr>
  );
}

function TabHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[22px] font-bold text-blue-600">{title}</h2>
        <p className="text-[12px] text-gray-500 mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

const tabMeta: Record<string, { title: string; subtitle: string }> = {
  personal: { title: "Thông tin cá nhân", subtitle: "Các thông tin cá nhân, liên hệ, học vấn và lịch sử làm việc" },
  work: { title: "Thông tin công việc", subtitle: "Thông tin về công việc, sự nghiệp, các kế hoạch phát triển và các nghiệp vụ được giao" },
  salary: { title: "Lương và phúc lợi", subtitle: "Bảng lương và phúc lợi" },
  violation: { title: "Vi phạm", subtitle: "Các vi phạm quy định làm việc, chính sách" },
  award: { title: "Thành tựu và giải thưởng", subtitle: "Giải thưởng, chứng chỉ, cột mốc và sự ghi nhận nhân sự đã đạt được" },
  contract: { title: "Hợp đồng & văn bản", subtitle: "Hợp đồng, lịch sử hợp đồng và văn bản của nhân sự" },
  review: { title: "Đánh giá nhân sự", subtitle: "Thông tin kết quả các bài kiểm tra năng lực" },
  mei: { title: "Thông tin mei", subtitle: "Thông tin mei của nhân sự theo dự án" },
};

export function EmployeeProfile({ onBack }: { onBack?: () => void }) {
  const [active, setActive] = useState("personal");
  const avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamThiThu&backgroundColor=ffd5dc";
  const meta = tabMeta[active];

  return (
    <div className="px-6 lg:px-8 py-6 h-[calc(100vh-7rem)] flex flex-col">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:text-blue-700 mb-4 font-medium shrink-0">
        <ChevronLeft className="h-4 w-4" /> Trở về danh sách nhân sự
      </button>

      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left sidebar - fixed */}
        <aside className="col-span-12 lg:col-span-3 lg:h-full lg:overflow-hidden flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm shrink-0">
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-orange-100 bg-orange-50">
                <img src={avatar} alt="Phạm Thị Thu" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 font-semibold text-[16px] text-gray-900">Phạm Thị Thu</div>
              <div className="text-[12px] text-gray-500">QA</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-[12px] text-gray-700">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" /> thupt@navisoft.com.vn</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" /> 0364466393</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" /> ThuPT36@fpt.com</div>
            </div>
          </div>

          <nav className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm flex-1 min-h-0">
            {navItems.map((it) => {
              const Icon = it.icon;
              const isActive = active === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => setActive(it.key)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                    isActive ? "bg-blue-50" : "hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", isActive ? "text-blue-600" : "text-gray-500")} />
                  <div className="min-w-0">
                    <div className={cn("text-[13px] font-semibold leading-tight", isActive ? "text-blue-700" : "text-gray-800")}>{it.label}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">{it.desc}</div>
                  </div>
                  {isActive && <span className="ml-auto w-0.5 h-8 rounded-full bg-blue-600 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main - scrollable */}
        <section className="col-span-12 lg:col-span-9 lg:h-full lg:min-h-0 lg:overflow-y-auto pr-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-full">
            <TabHeader
              title={meta.title}
              subtitle={meta.subtitle}
              action={
                active === "review" || active === "mei" ? (
                  <button className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                    <Plus className="h-4 w-4" /> Thêm
                  </button>
                ) : (
                  <button className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                    <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
                  </button>
                )
              }
            />

            {active === "personal" && (
              <>
            <div className="mt-5">
              <SectionHeader title="Thông tin chính" subtitle="Các thông tin cá nhân quan trọng" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                <Field label="Họ và tên" value="Phạm Thị Thu" />
                <Field label="Ngày sinh" value="26/02/1997" />
                <Field label="Ngày bắt đầu" value="10/08/2022" />
                <Field label="Ngày chính thức" value="01/10/2022" />
                <Field label="Loại nhân sự" value="Nhân viên" />
                <Field label="Tình trạng làm việc" value="Bình thường" />
                <Field label="Hợp đồng hiện tại" value="Hợp đồng 3 năm" />
                <Field label="Số điện thoại" value="0364466393" />
                <Field label="Chức danh" value="QA" />
                <Field label="Email công việc" value="thupt@navisoft.com.vn" />
                <Field label="Giới tính" value="Nữ" />
                <Field label="Tình trạng hôn nhân" value="Chưa kết hôn" />
                <Field label="Tổng số Mei theo kế hoạch" value="0" />
                <Field label="Tổng số Mei thực tế" value="0" />
                <Field label="Ghi chú thêm" value="thuvbnd2610@gmail.com" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <SectionHeader title="Thông tin cá nhân bổ sung" subtitle="Một số thông tin cá nhân bổ sung" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                <Field label="Địa chỉ hiện tại" value="" />
                <Field label="Nơi sinh" value="Nam Định" />
                <Field label="Hộ khẩu thường trú" value="Nhị Giáp, Xã Liên Minh, Tỉnh Ninh Bình" />
                <Field label="Quốc tịch" value="Việt Nam" />
                <Field label="CMT/CCCD" value="036197014212" />
                <Field label="Ngày cấp" value="17/05/2021" />
                <Field label="Nơi cấp" value="CCSQLHCVTTXH" />
                <Field label="Email cá nhân" value="ThuPT36@fpt.com" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <SectionHeader title="Thông tin học vấn" subtitle="Chi tiết lịch sử học vấn" />
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-blue-50/60 text-gray-700">
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Trường học</th>
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Chuyên ngành</th>
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Khoảng thời gian</th>
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-3">Đại học xây dựng</td>
                    <td className="px-3 py-3">Kỹ thuật môi trường</td>
                    <td className="px-3 py-3">15/09/2015 - 31/10/2019</td>
                    <td className="px-3 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <SectionHeader title="Lịch sử làm việc" subtitle="Chi tiết lịch sử làm việc" />
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-blue-50/60 text-gray-700">
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Công ty</th>
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Vị trí</th>
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Khoảng thời gian</th>
                    <th className="text-left font-semibold px-3 py-2 border-l-2 border-white">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-3 py-5 text-center">
                      <span className="inline-block px-3 py-1.5 text-[12px] text-gray-500 bg-gray-50 border border-gray-200 rounded-md">Không có dữ liệu</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <SectionHeader title="Hồ sơ xin việc" subtitle="Danh sách hồ sơ xin việc" />
              <a href="#" className="inline-flex items-center gap-2 text-[13px] text-blue-600 hover:text-blue-700 font-medium">
                <FileIcon className="h-4 w-4" />
                20231031153509044ilovepdf_merged-(1).pdf
              </a>
            </div>
              </>
            )}

            {active === "work" && (
              <>
                <div className="mt-5">
                  <SectionHeader title="Thông tin chính" subtitle="Thông tin quan về công việc hiện tại" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                    <Field label="Vị trí" value="QA" />
                    <Field label="Lương" value="---" />
                    <Field label="Ngày bắt đầu" value="01/10/2022" />
                    <Field label="Ngày chính thức" value="10/08/2022" />
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <SectionHeader title="Dự án tham gia" subtitle="Chi tiết về các dự án đã và đang tham gia" />
                  <table className="w-full text-[13px]">
                    <TableHead cols={["Dự án", "Chức danh", "Khoảng thời gian", "Chức năng"]} />
                    <tbody><EmptyRow span={4} /></tbody>
                  </table>
                </div>
              </>
            )}

            {active === "salary" && (
              <div className="mt-5">
                <SectionHeader title="Thông tin về lịch sử lương" subtitle="Thông tin về mức lương hiện tại" />
                <table className="w-full text-[13px]">
                  <TableHead cols={["Ngày", "Hợp đồng", "Chức danh", "Bậc lương", "Lương", "Chức năng"]} />
                  <tbody><EmptyRow span={6} /></tbody>
                </table>
              </div>
            )}

            {active === "violation" && (
              <div className="mt-5">
                <SectionHeader title="Các vi phạm quy định làm việc" subtitle="Danh sách vi phạm quy định làm việc" />
                <table className="w-full text-[13px]">
                  <TableHead cols={["Lý do", "Loại vi phạm", "Cấp độ vi phạm", "Chức năng"]} />
                  <tbody><EmptyRow span={4} /></tbody>
                </table>
              </div>
            )}

            {active === "award" && (
              <div className="mt-5">
                <SectionHeader title="Giải thưởng" subtitle="Các giải thưởng của công ty tôi nhận được" />
                <div className="border-t border-gray-100" />
              </div>
            )}

            {active === "contract" && (
              <>
                <div className="mt-5">
                  <SectionHeader title="Hợp đồng hiện tại" subtitle="Thông tin hợp đồng mới nhất" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
                    <Field label="Hợp đồng" value="Hợp đồng 3 năm" />
                    <Field label="Ngày bắt đầu" value="01/04/2024" />
                    <Field label="Ngày kết thúc" value="31/03/2027" />
                    <Field label="Trạng thái" value="hợp đồng hiện tại" />
                    <Field label="Tạo bởi" value="Thuna" />
                    <Field label="Ngày tạo" value="15/04/2024" />
                    <Field label="Ghi chú thêm" value="" />
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <SectionHeader title="Lịch sử tất cả hợp đồng" subtitle="Danh sách tất cả hợp đồng của nhân viên" />
                  <table className="w-full text-[13px]">
                    <TableHead cols={["Hợp đồng", "Ngày tạo", "Trạng thái", "File hợp đồng", "Chức năng"]} />
                    <tbody>
                      {[
                        { name: "Thử việc", date: "10/08/2022", status: "hợp đồng quá khứ", file: "20231121030132151_ct..." },
                        { name: "Hợp đồng đào tạo 6 thá...", date: "01/10/2022", status: "hợp đồng quá khứ", file: "20231121030200471_ct..." },
                        { name: "Hợp đồng 1 năm", date: "01/04/2023", status: "hợp đồng quá khứ", file: "20231121030228932_ct..." },
                        { name: "Hợp đồng 3 năm", date: "01/04/2024", status: "hợp đồng hiện tại", file: "20240415151220153_ct..." },
                      ].map((r, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="px-3 py-3">{r.name}</td>
                          <td className="px-3 py-3">{r.date}</td>
                          <td className="px-3 py-3">{r.status}</td>
                          <td className="px-3 py-3"><a className="text-blue-600 hover:underline" href="#">{r.file}</a></td>
                          <td className="px-3 py-3"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {active === "review" && (
              <div className="mt-5">
                <SectionHeader title="Thông tin đánh giá nhân sự" subtitle="Danh sách tất cả đánh giá nhân sự, kết quả test, check point, đánh giá chất lượng" />
                <table className="w-full text-[13px]">
                  <TableHead cols={["Loại đánh giá", "Điểm", "Kết quả bài kiểm tra", "Loại bài kiểm tra", "Đơn vị kỳ checkpoint", "Kỳ checkpoint", "Tên bài kiểm tra", "Chức năng"]} />
                  <tbody>
                    {[
                      { type: "Kết quả test", score: "8.8", result: "Đạt", kind: "Test chuyên môn", unit: "", period: "", name: "Kiến thức test T4.2025" },
                      { type: "Kết quả test", score: "9.2", result: "Đạt", kind: "Nội quy", unit: "", period: "", name: "Sổ tay nhân sự T4.2025" },
                    ].map((r, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-3 py-3">{r.type}</td>
                        <td className="px-3 py-3">{r.score}</td>
                        <td className="px-3 py-3">{r.result}</td>
                        <td className="px-3 py-3">{r.kind}</td>
                        <td className="px-3 py-3">{r.unit}</td>
                        <td className="px-3 py-3">{r.period}</td>
                        <td className="px-3 py-3">{r.name}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2 text-gray-500">
                            <button className="hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                            <button className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                            <button className="hover:text-blue-600"><Info className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {active === "mei" && (
              <div className="mt-5">
                <SectionHeader title="Thông mei theo dự án" subtitle="Danh sách tất cả mei theo dự án của nhân viên" />
                <table className="w-full text-[13px]">
                  <TableHead cols={["Tên dự án", "Mã dự án", "Tháng", "Năm", "Số point", "Số mei kế hoạch", "Số mei thực tế", "Chức năng"]} />
                  <tbody><EmptyRow span={8} /></tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}