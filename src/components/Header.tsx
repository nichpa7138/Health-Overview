import React from 'react';
import { 
  HeartPulse, 
  RefreshCw, 
  Calendar, 
  Printer,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Table as TableIcon
} from 'lucide-react';

interface HeaderProps {
  isLoading: boolean;
  isLive: boolean;
  lastUpdated: string;
  totalRecords: number;
  filteredRecordsCount: number;
  onRefresh: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoading,
  isLive,
  lastUpdated,
  totalRecords,
  filteredRecordsCount,
  onRefresh,
  activeSection,
  onNavigate
}) => {
  const navItems = [
    { id: 'overview', label: 'ภาพรวม (KPIs)', icon: HeartPulse },
    { id: 'health-risk', label: 'การวิเคราะห์ความเสี่ยง', icon: ShieldCheck },
    { id: 'health-trend', label: 'แนวโน้มรายเดือน', icon: TrendingUp },
    { id: 'health-behavior', label: 'พฤติกรรม & โรคเสี่ยง', icon: Activity },
    { id: 'data-table', label: 'ตารางข้อมูลเชิงลึก', icon: TableIcon }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200 ring-4 ring-rose-100/70">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  รายงานสรุปผลคัดกรองสุขภาพ
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  ระบบคัดกรองสุขภาพ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                <span>สรุปภาพรวมและวิเคราะห์กลุ่มเสี่ยงเชิงลึกรายบุคคล</span>
              </p>
            </div>
          </div>

          {/* Controls & Connection Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Sync Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isLive ? 'ซิงค์สำเร็จ' : 'ข้อมูลชุดล่าสุด'}</span>
              <span className="text-emerald-400">|</span>
              <span className="text-slate-600 font-mono text-[11px]">{lastUpdated}</span>
            </div>

            {/* Refresh Button */}
            <button
              id="refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-xs shadow-rose-300 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
            </button>

            {/* Print Button */}
            <button
              id="print-btn"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              title="พิมพ์รายงาน"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">พิมพ์รายงาน</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar (Single Page Nav) */}
        <div className="no-print pt-1 pb-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-rose-100/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs shadow-rose-200'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="ml-auto text-xs text-slate-500 font-medium whitespace-nowrap pl-3">
            แสดง <span className="text-rose-600 font-semibold">{filteredRecordsCount}</span> จาก {totalRecords} ราย
          </div>
        </div>

      </div>
    </header>
  );
};
