import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  Search, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { HealthRecord } from '../types';
import { DetailModal } from './DetailModal';

interface DataTableSectionProps {
  records: HealthRecord[];
}

type SortField = 'id' | 'date' | 'area' | 'gender' | 'age' | 'bmi' | 'sbp' | 'sugar' | 'riskScore' | 'riskLevel';
type SortOrder = 'asc' | 'desc';

export const DataTableSection: React.FC<DataTableSectionProps> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableSearch, setTableSearch] = useState<string>('');

  // Filtering within table
  const filteredData = useMemo(() => {
    if (!tableSearch.trim()) return records;
    const q = tableSearch.toLowerCase().trim();
    return records.filter(r => 
      r.id.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.gender.toLowerCase().includes(q) ||
      r.date.toLowerCase().includes(q) ||
      r.riskLevel.toLowerCase().includes(q)
    );
  }, [records, tableSearch]);

  // Sorting
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'riskLevel') {
        const orderMap: Record<string, number> = { 'ต่ำ': 1, 'ปานกลาง': 2, 'สูง': 3 };
        aVal = orderMap[a.riskLevel] || 0;
        bVal = orderMap[b.riskLevel] || 0;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal, 'th') 
          : bVal.localeCompare(aVal, 'th');
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return list;
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  const totalPages = pageSize === -1 ? 1 : Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (pageSize === -1) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportCSV = () => {
    const headers = [
      'รหัสบุคคล', 'วันที่คัดกรอง', 'พื้นที่', 'เพศ', 'อายุ', 'ส่วนสูง_cm', 'น้ำหนัก_kg',
      'BMI', 'SBP_mmHg', 'DBP_mmHg', 'ชีพจร_bpm', 'น้ำตาล_mg_dL', 'สูบบุหรี่', 'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย', 'เบาหวาน_คัดกรอง', 'ความดันโลหิตสูง_คัดกรอง', 'คะแนนความเสี่ยง', 'ระดับความเสี่ยง', 'เดือน'
    ];
    const rows = sortedData.map(r => [
      `"${r.id}"`, `"${r.date}"`, `"${r.area}"`, `"${r.gender}"`, r.age, r.height, r.weight,
      r.bmi, r.sbp, r.dbp, r.pulse, r.sugar, `"${r.smoking}"`, `"${r.alcohol}"`,
      `"${r.exercise}"`, `"${r.diabetesRisk}"`, `"${r.hypertensionRisk}"`, r.riskScore, `"${r.riskLevel}"`, `"${r.month}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานผลคัดกรองสุขภาพ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get color styles according to risk level: Red (สูง), Yellow (ปานกลาง), Green (ต่ำ)
  const getRiskRowStyle = (level: string) => {
    if (level === 'สูง') {
      return {
        borderLeft: 'border-l-4 border-l-red-500',
        badge: 'bg-red-100 text-red-800 border border-red-200',
        dot: 'bg-red-500',
        hover: 'hover:bg-red-50/40'
      };
    }
    if (level === 'ปานกลาง') {
      return {
        borderLeft: 'border-l-4 border-l-amber-500',
        badge: 'bg-amber-100 text-amber-800 border border-amber-200',
        dot: 'bg-amber-500',
        hover: 'hover:bg-amber-50/40'
      };
    }
    return {
      borderLeft: 'border-l-4 border-l-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      dot: 'bg-emerald-500',
      hover: 'hover:bg-emerald-50/40'
    };
  };

  return (
    <section id="data-table" className="mb-12 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm shadow-rose-200">
            <TableIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>ตารางแสดงรายละเอียดข้อมูลคัดกรองสุขภาพ (Detail View)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                {sortedData.length} รายการ
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              ตารางแสดงข้อมูลรายบุคคล พร้อมแถบสีตามระดับกลุ่มเสี่ยง (แดง: สูง | เหลือง: ปานกลาง | เขียว: ต่ำ)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="no-print flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
              placeholder="ค้นหาในตาราง..."
              className="w-44 sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-sm shadow-rose-100/40 overflow-hidden">
        
        {/* Color Legend Bar */}
        <div className="bg-slate-50/80 px-5 py-2.5 border-b border-rose-100/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">สัญลักษณ์แถบสีความเสี่ยง:</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> แถบเขียว: เสี่ยงต่ำ
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> แถบเหลือง: เสี่ยงปานกลาง
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> แถบแดง: เสี่ยงสูง
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            *คลิกที่แถวหรือไอคอนตาเพื่อดูการประเมินรายบุคคล
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-rose-50/50 text-slate-600 uppercase font-semibold text-[11px] border-b border-rose-100">
              <tr>
                <th scope="col" className="py-3 px-4 text-center w-12">ระดับ</th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('id')}>
                  <span className="flex items-center gap-1">
                    รหัส <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('date')}>
                  <span className="flex items-center gap-1">
                    วันที่ <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('area')}>
                  <span className="flex items-center gap-1">
                    พื้นที่ <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('gender')}>
                  <span className="flex items-center gap-1">
                    เพศ/อายุ <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('bmi')}>
                  <span className="flex items-center gap-1">
                    BMI <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('sbp')}>
                  <span className="flex items-center gap-1">
                    ความดัน (SBP/DBP) <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('sugar')}>
                  <span className="flex items-center gap-1">
                    น้ำตาล (mg/dL) <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3">พฤติกรรม</th>
                <th scope="col" className="py-3 px-3">โรคเสี่ยง (DM / HT)</th>
                <th scope="col" className="py-3 px-3 text-center cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('riskScore')}>
                  <span className="flex items-center justify-center gap-1">
                    คะแนน <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 text-center cursor-pointer select-none hover:text-rose-600" onClick={() => handleSort('riskLevel')}>
                  <span className="flex items-center justify-center gap-1">
                    กลุ่มเสี่ยง <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 text-center w-14">ดู</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50/80">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-400">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const style = getRiskRowStyle(item.riskLevel);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRecord(item)}
                      className={`cursor-pointer transition-colors ${style.borderLeft} ${style.hover}`}
                    >
                      {/* Color indicator icon */}
                      <td className="py-3 px-4 text-center">
                        <span className={`w-3 h-3 rounded-full inline-block ${style.dot}`} />
                      </td>

                      {/* ID */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {item.id}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Area */}
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {item.area}
                      </td>

                      {/* Gender / Age */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{item.gender}</span>
                        <span className="text-slate-400 ml-1">({item.age} ปี)</span>
                      </td>

                      {/* BMI */}
                      <td className="py-3 px-3 font-mono font-medium">
                        <span className={item.bmi >= 25 ? 'text-rose-600 font-bold' : item.bmi >= 23 ? 'text-amber-600' : 'text-slate-700'}>
                          {item.bmi}
                        </span>
                      </td>

                      {/* BP */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        <span className={item.sbp >= 140 ? 'text-rose-600 font-bold' : item.sbp >= 120 ? 'text-amber-600' : 'text-slate-700'}>
                          {item.sbp}
                        </span>
                        <span className="text-slate-400">/{item.dbp}</span>
                      </td>

                      {/* Sugar */}
                      <td className="py-3 px-3 font-mono">
                        <span className={item.sugar >= 126 ? 'text-rose-600 font-bold' : item.sugar >= 100 ? 'text-amber-600' : 'text-slate-700'}>
                          {item.sugar}
                        </span>
                      </td>

                      {/* Behaviors */}
                      <td className="py-3 px-3 text-[11px] whitespace-nowrap">
                        <span className={`mr-1.5 ${item.smoking === 'สูบ' ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                          {item.smoking === 'สูบ' ? 'สูบ' : 'ไม่สูบ'}
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className={`mx-1.5 ${item.alcohol === 'ดื่ม' ? 'text-pink-600 font-bold' : 'text-slate-400'}`}>
                          {item.alcohol === 'ดื่ม' ? 'ดื่ม' : 'ไม่ดื่ม'}
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="ml-1.5 text-slate-600">
                          {item.exercise === 'ไม่ออกกำลังกาย' ? 'ไม่ออก' : item.exercise}
                        </span>
                      </td>

                      {/* DM / HT risks */}
                      <td className="py-3 px-3 text-[11px] whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded-md mr-1 ${
                          item.diabetesRisk.includes('เสี่ยง') ? 'bg-red-50 text-red-700 font-medium' : 'text-slate-400'
                        }`}>
                          DM: {item.diabetesRisk.includes('เสี่ยง') ? 'เสี่ยง' : 'ปกติ'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-md ${
                          item.hypertensionRisk.includes('เสี่ยง') ? 'bg-red-50 text-red-700 font-medium' : 'text-slate-400'
                        }`}>
                          HT: {item.hypertensionRisk.includes('เสี่ยง') ? 'เสี่ยง' : 'ปกติ'}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                        {item.riskScore}
                      </td>

                      {/* Risk Level Badge */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {item.riskLevel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                          className="w-7 h-7 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer mx-auto"
                          title="ดูรายละเอียดข้อมูล"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="no-print bg-white px-5 py-3 border-t border-rose-100/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>แสดงแถวละ:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-hidden"
            >
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={-1}>ทั้งหมด ({sortedData.length})</option>
            </select>
            <span className="text-slate-400">|</span>
            <span>
              หน้า {currentPage} จาก {totalPages || 1} (ทั้งหมด {sortedData.length} รายการ)
            </span>
          </div>

          {pageSize !== -1 && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold cursor-pointer transition-colors ${
                    currentPage === page
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white hover:bg-rose-50 border border-slate-200 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Detail Modal */}
      <DetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </section>
  );
};
