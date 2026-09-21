import React from 'react';
import { 
  Users, 
  UserCheck, 
  Scale, 
  Activity, 
  Droplet, 
  CalendarDays,
  ArrowUpRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryCardsProps {
  stats: SummaryStats;
  totalDatasetCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, totalDatasetCount }) => {
  // BMI classification according to Asian / WHO criteria
  const getBmiBadge = (bmi: number) => {
    if (bmi < 18.5) return { label: 'น้ำหนักน้อย', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (bmi < 23) return { label: 'สมส่วนปกติ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (bmi < 25) return { label: 'น้ำหนักเกิน (ท้วม)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'ภาวะอ้วน', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  // SBP classification
  const getSbpBadge = (sbp: number) => {
    if (sbp < 120) return { label: 'ความดันปกติ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (sbp < 140) return { label: 'เริ่มสูง (Pre-HT)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'ความดันสูง (HT)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  // Sugar classification
  const getSugarBadge = (sugar: number) => {
    if (sugar < 100) return { label: 'ระดับปกติ (<100)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (sugar < 126) return { label: 'เสี่ยงเบาหวาน (100-125)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'เข้าเกณฑ์เบาหวาน (≥126)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const bmiBadge = getBmiBadge(stats.avgBmi);
  const sbpBadge = getSbpBadge(stats.avgSbp);
  const sugarBadge = getSugarBadge(stats.avgSugar);

  const percentOfTotal = totalDatasetCount > 0 
    ? Math.round((stats.total / totalDatasetCount) * 100) 
    : 100;

  return (
    <section id="overview" className="mb-8 scroll-mt-28">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm shadow-rose-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Health Overview (สรุปตัวชี้วัดสุขภาพสำคัญ)</span>
            </h2>
            <p className="text-xs text-slate-500">
              ค่าเฉลี่ยและสัดส่วนประชากรที่ผ่านการคัดกรองตามข้อมูลล่าสุด
            </p>
          </div>
        </div>

        {/* High Risk Quick Alert */}
        {stats.highRiskCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
            <ShieldAlert className="w-4 h-4 text-red-600 animate-bounce" />
            <span>พบกลุ่มเสี่ยงสูง <strong className="font-bold text-red-700">{stats.highRiskCount} คน</strong> ({Math.round((stats.highRiskCount / (stats.total || 1)) * 100)}%)</span>
          </div>
        )}
      </div>

      {/* 6 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* 1. Total Screened Population */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-rose-50 rounded-full opacity-60 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">จำนวนประชากร</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.total}</span>
            <span className="text-xs font-semibold text-slate-500">คน</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-rose-50">
            <span>สัดส่วนข้อมูล</span>
            <span className="font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
              {percentOfTotal}% ของทั้งหมด
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="text-emerald-600 font-medium">ต่ำ {stats.lowRiskCount}</span>
            <span className="text-amber-600 font-medium">กลาง {stats.midRiskCount}</span>
            <span className="text-rose-600 font-medium">สูง {stats.highRiskCount}</span>
          </div>
        </div>

        {/* 2. Gender Ratio */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">สัดส่วน ชาย / หญิง</span>
            <div className="w-8 h-8 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl sm:text-2xl font-bold text-sky-700 font-mono">{stats.maleRatio}%</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xl sm:text-2xl font-bold text-pink-600 font-mono">{stats.femaleRatio}%</span>
          </div>
          {/* Dual bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex my-2">
            <div 
              style={{ width: `${stats.maleRatio}%` }} 
              className="bg-sky-500 h-full transition-all duration-500" 
              title={`ชาย: ${stats.maleCount} คน`}
            />
            <div 
              style={{ width: `${stats.femaleRatio}%` }} 
              className="bg-pink-500 h-full transition-all duration-500" 
              title={`หญิง: ${stats.femaleCount} คน`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              ชาย {stats.maleCount} คน
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              หญิง {stats.femaleCount} คน
            </span>
          </div>
        </div>

        {/* 3. Average Age */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">อายุเฉลี่ย</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.avgAge}</span>
            <span className="text-xs font-semibold text-slate-500">ปี</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-rose-50">
            <span>ช่วงอายุ</span>
            <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
              {stats.minAge} - {stats.maxAge} ปี
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            กลุ่มวัยทำงานและผู้สูงอายุ
          </div>
        </div>

        {/* 4. Average BMI */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">BMI เฉลี่ย</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.avgBmi}</span>
            <span className="text-xs font-semibold text-slate-500">kg/m²</span>
          </div>
          <div className="pt-2 border-t border-rose-50">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${bmiBadge.color}`}>
              {bmiBadge.label}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            เกณฑ์มาตรฐานเอเชีย: 18.5 - 22.9
          </div>
        </div>

        {/* 5. Average SBP */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">SBP เฉลี่ย (ความดัน)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.avgSbp}</span>
            <span className="text-xs text-slate-400">/{stats.avgDbp}</span>
            <span className="text-xs font-semibold text-slate-500">mmHg</span>
          </div>
          <div className="pt-2 border-t border-rose-50">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${sbpBadge.color}`}>
              {sbpBadge.label}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>ชีพจรเฉลี่ย:</span>
            <span className="font-mono text-purple-700 font-medium">{stats.avgPulse} bpm</span>
          </div>
        </div>

        {/* 6. Average Blood Sugar */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 relative overflow-hidden transition-all hover:shadow-md hover:border-rose-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">น้ำตาลเฉลี่ย</span>
            <div className="w-8 h-8 rounded-xl bg-red-100/80 text-red-600 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono">{stats.avgSugar}</span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="pt-2 border-t border-rose-50">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${sugarBadge.color}`}>
              {sugarBadge.label}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            เกณฑ์ปกติ: &lt; 100 mg/dL
          </div>
        </div>

      </div>
    </section>
  );
};
