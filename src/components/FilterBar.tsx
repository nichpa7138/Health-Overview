import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  MapPin, 
  Users, 
  User, 
  Clock, 
  ShieldAlert, 
  Cigarette, 
  Wine, 
  Search,
  Check
} from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  areas: string[];
  totalRecords: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  areas,
  totalRecords,
  filteredCount
}) => {
  const isFiltered = 
    filters.area !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.ageGroup !== 'ทั้งหมด' ||
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.smoking !== 'ทั้งหมด' ||
    filters.alcohol !== 'ทั้งหมด' ||
    filters.searchQuery !== '';

  return (
    <div className="no-print bg-white rounded-3xl p-5 border border-rose-100/90 shadow-sm shadow-rose-100/50 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100/60 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>ตัวกรองข้อมูลและการค้นหา</span>
              {isFiltered && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500 text-white">
                  เปิดใช้งานตัวกรอง
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">กรองข้อมูลประชากรเพื่อวิเคราะห์กลุ่มเสี่ยงเฉพาะกลุ่ม</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600 bg-rose-50/70 px-3 py-1.5 rounded-xl border border-rose-100">
            ผลลัพธ์: <strong className="text-rose-600 font-bold">{filteredCount}</strong> / {totalRecords} คน
          </div>
          {isFiltered && (
            <button
              id="reset-filter-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        
        {/* Search */}
        <div className="xl:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-rose-500" />
            <span>ค้นหารหัส / วันที่</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="search-input"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              placeholder="พิมพ์รหัสบุคคล เช่น H0001..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>พื้นที่</span>
          </label>
          <select
            id="filter-area"
            value={filters.area}
            onChange={(e) => onFilterChange('area', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden transition-all text-slate-800"
          >
            <option value="ทั้งหมด">ทั้งหมด (ทุกพื้นที่)</option>
            {areas.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-rose-500" />
            <span>เพศ</span>
          </label>
          <select
            id="filter-gender"
            value={filters.gender}
            onChange={(e) => onFilterChange('gender', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden transition-all text-slate-800"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>

        {/* Age Group Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>กลุ่มอายุ</span>
          </label>
          <select
            id="filter-age"
            value={filters.ageGroup}
            onChange={(e) => onFilterChange('ageGroup', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden transition-all text-slate-800"
          >
            <option value="ทั้งหมด">ทุกช่วงอายุ</option>
            <option value="<35">&lt; 35 ปี</option>
            <option value="35-49">35 - 49 ปี</option>
            <option value="50-59">50 - 59 ปี</option>
            <option value="60+">60 ปีขึ้นไป</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>ระดับความเสี่ยง</span>
          </label>
          <select
            id="filter-risk"
            value={filters.riskLevel}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden transition-all text-slate-800"
          >
            <option value="ทั้งหมด">ทุกระดับความเสี่ยง</option>
            <option value="ต่ำ">🟢 เสี่ยงต่ำ</option>
            <option value="ปานกลาง">🟡 เสี่ยงปานกลาง</option>
            <option value="สูง">🔴 เสี่ยงสูง</option>
          </select>
        </div>

        {/* Smoking & Alcohol (Combined row on narrow screens) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Cigarette className="w-3.5 h-3.5 text-rose-500" />
            <span>สูบบุหรี่</span>
          </label>
          <select
            id="filter-smoking"
            value={filters.smoking}
            onChange={(e) => onFilterChange('smoking', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50/70 hover:bg-white focus:bg-white rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-hidden transition-all text-slate-800"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ไม่สูบ">ไม่สูบ</option>
            <option value="สูบ">สูบบุหรี่</option>
          </select>
        </div>

      </div>

      {/* Alcohol Quick Toggle & Quick Risk Badges */}
      <div className="mt-3 pt-3 border-t border-rose-50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Wine className="w-3.5 h-3.5 text-rose-500" /> ดื่มแอลกอฮอล์:
          </span>
          {['ทั้งหมด', 'ไม่ดื่ม', 'ดื่ม'].map((alc) => (
            <button
              key={alc}
              id={`filter-alc-${alc}`}
              onClick={() => onFilterChange('alcohol', alc)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filters.alcohol === alc
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-rose-50/70 text-slate-600 hover:bg-rose-100/70'
              }`}
            >
              {alc === 'ทั้งหมด' ? 'ทั้งหมด' : alc}
            </button>
          ))}
        </div>

        {/* Quick Risk Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">ด่วน:</span>
          <button
            onClick={() => onFilterChange('riskLevel', filters.riskLevel === 'สูง' ? 'ทั้งหมด' : 'สูง')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border cursor-pointer transition-all ${
              filters.riskLevel === 'สูง' 
                ? 'bg-red-500 text-white border-red-600 ring-2 ring-red-200' 
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            🔴 เฉพาะกลุ่มเสี่ยงสูง
          </button>
          <button
            onClick={() => onFilterChange('riskLevel', filters.riskLevel === 'ปานกลาง' ? 'ทั้งหมด' : 'ปานกลาง')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border cursor-pointer transition-all ${
              filters.riskLevel === 'ปานกลาง' 
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            🟡 เสี่ยงปานกลาง
          </button>
          <button
            onClick={() => onFilterChange('riskLevel', filters.riskLevel === 'ต่ำ' ? 'ทั้งหมด' : 'ต่ำ')}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border cursor-pointer transition-all ${
              filters.riskLevel === 'ต่ำ' 
                ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            🟢 เสี่ยงต่ำ
          </button>
        </div>
      </div>

    </div>
  );
};
