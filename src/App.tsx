import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  HeartPulse, 
  AlertCircle
} from 'lucide-react';
import { HealthRecord, FilterState } from './types';
import { fetchHealthRecords, GOOGLE_SHEET_ID } from './services/sheetService';
import { filterRecords, computeSummaryStats } from './utils/calculations';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SummaryCards } from './components/SummaryCards';
import { HealthRiskSection } from './components/HealthRiskSection';
import { HealthTrendSection } from './components/HealthTrendSection';
import { HealthBehaviorSection } from './components/HealthBehaviorSection';
import { DataTableSection } from './components/DataTableSection';

const initialFilters: FilterState = {
  area: 'ทั้งหมด',
  gender: 'ทั้งหมด',
  ageGroup: 'ทั้งหมด',
  riskLevel: 'ทั้งหมด',
  smoking: 'ทั้งหมด',
  alcohol: 'ทั้งหมด',
  searchQuery: ''
};

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchHealthRecords();
      setRecords(res.data);
      setIsLive(res.isLive);
      setLastUpdated(res.lastUpdated);
      setSource(res.source);
      if (res.error) {
        console.warn(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Unique areas for dropdown
  const uniqueAreas = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set);
  }, [records]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // Computed summary stats
  const summaryStats = useMemo(() => {
    return computeSummaryStats(filteredRecords);
  }, [filteredRecords]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-pink-50/20 to-rose-50/30 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      
      {/* 1. Header & Navigation (Single Page Controls) */}
      <Header
        isLoading={isLoading}
        isLive={isLive}
        lastUpdated={lastUpdated}
        totalRecords={records.length}
        filteredRecordsCount={filteredRecords.length}
        onRefresh={loadData}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error Notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage} (ระบบแสดงข้อมูลสำรองล่าสุดจากชีต ID: {GOOGLE_SHEET_ID})</span>
            </div>
            <button
              onClick={loadData}
              className="font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* 1. Filters Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          areas={uniqueAreas}
          totalRecords={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* 2. KPI Cards / Summary Cards (Health Overview) */}
        <SummaryCards
          stats={summaryStats}
          totalDatasetCount={records.length}
        />

        {/* 3. Visualizations / Charts */}
        {/* 3.1 Health Risk */}
        <HealthRiskSection
          records={filteredRecords}
        />

        {/* 3.2 Health Trend */}
        <HealthTrendSection
          records={filteredRecords}
        />

        {/* 3.3 Health Behavior */}
        <HealthBehaviorSection
          records={filteredRecords}
        />

        {/* 4. Data Table / Detail View (With Red, Yellow, Green color bars) */}
        <DataTableSection
          records={filteredRecords}
        />

      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-rose-100 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-700">แดชบอร์ดรายงานสรุปผลการคัดกรองสุขภาพ</span>
          </div>

          <div className="text-[11px] text-slate-400">
            ปรับปรุงล่าสุด: <span className="font-mono text-slate-600">{lastUpdated || '-'}</span> ({source || 'ระบบ'})
          </div>
        </div>
      </footer>

    </div>
  );
}
