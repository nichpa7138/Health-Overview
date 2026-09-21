import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList
} from 'recharts';
import { HealthRecord } from '../types';
import { getMonthlyTrendData } from '../utils/calculations';

interface HealthTrendSectionProps {
  records: HealthRecord[];
}

export const HealthTrendSection: React.FC<HealthTrendSectionProps> = ({ records }) => {
  const trendData = getMonthlyTrendData(records);

  // Custom Tooltip
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-rose-100 text-xs min-w-[150px]">
          <p className="font-bold text-slate-800 mb-1.5 pb-1 border-b border-rose-100 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>เดือน {label}</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`trend-${index}`} className="flex items-center justify-between gap-3 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold font-mono text-slate-900">{entry.value} คน</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="health-trend" className="mb-8 scroll-mt-28">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm shadow-rose-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Health Trend (แนวโน้มสุขภาพรายเดือน)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                ม.ค. - มี.ค. 2569
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์จำนวนผู้คัดกรองและแนวโน้มการเปลี่ยนแปลงของกลุ่มเสี่ยงในแต่ละเดือน
            </p>
          </div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Monthly Screened Count (Area Chart with Pink Gradient) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>1. จำนวนผู้คัดกรองรายเดือน</span>
              </h3>
              <p className="text-xs text-slate-500">ปริมาณผู้เข้ารับการตรวจคัดกรองในแต่ละรอบเดือน</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-xl">
              ม.ค. - มี.ค.
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 20, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="ผู้คัดกรอง" 
                  stroke="#e11d48" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#pinkGradient)" 
                  dot={{ r: 5, fill: '#e11d48', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                >
                  <LabelList 
                    dataKey="ผู้คัดกรอง" 
                    position="top" 
                    offset={10} 
                    fill="#be123c" 
                    fontSize={12} 
                    fontWeight={700}
                    formatter={(v: any) => `${v} คน`}
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Comparison Chips */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-rose-50 mt-2">
            {trendData.map((m, idx) => (
              <div key={m.month} className="bg-rose-50/50 p-2.5 rounded-2xl border border-rose-100/60 text-center">
                <span className="text-[11px] font-semibold text-slate-500">{m.month}</span>
                <div className="text-base font-bold font-mono text-rose-600 my-0.5">
                  {m.ผู้คัดกรอง} <span className="text-xs font-normal text-slate-500">คน</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {idx === 0 ? 'เดือนแรก' : idx === 1 ? 'สม่ำเสมอ' : 'เพิ่มขึ้น +33%'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Risk Level Trend (Multi-Line Chart with explicit labels) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>2. แนวโน้มกลุ่มเสี่ยงรายเดือน (ต่ำ / ปานกลาง / สูง)</span>
              </h3>
              <p className="text-xs text-slate-500">เปรียบเทียบการเปลี่ยนแปลงของกลุ่มเสี่ยงในแต่ละเดือน</p>
            </div>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                />
                
                {/* เสี่ยงต่ำ (Green) */}
                <Line 
                  type="monotone" 
                  dataKey="เสี่ยงต่ำ" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                >
                  <LabelList dataKey="เสี่ยงต่ำ" position="top" fill="#10b981" fontSize={11} fontWeight={700} />
                </Line>

                {/* เสี่ยงปานกลาง (Amber) */}
                <Line 
                  type="monotone" 
                  dataKey="เสี่ยงปานกลาง" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                >
                  <LabelList dataKey="เสี่ยงปานกลาง" position="top" fill="#d97706" fontSize={11} fontWeight={700} />
                </Line>

                {/* เสี่ยงสูง (Red) */}
                <Line 
                  type="monotone" 
                  dataKey="เสี่ยงสูง" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
                >
                  <LabelList dataKey="เสี่ยงสูง" position="top" fill="#b91c1c" fontSize={11} fontWeight={700} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown summary table */}
          <div className="pt-3 border-t border-rose-50 mt-2 text-xs">
            <div className="grid grid-cols-4 text-center font-semibold text-slate-500 pb-1 border-b border-slate-100 text-[11px]">
              <span>เดือน</span>
              <span className="text-emerald-600">เสี่ยงต่ำ</span>
              <span className="text-amber-600">ปานกลาง</span>
              <span className="text-rose-600">เสี่ยงสูง</span>
            </div>
            {trendData.map((m) => (
              <div key={m.month} className="grid grid-cols-4 text-center py-1 font-mono text-slate-700 text-xs hover:bg-rose-50/50 rounded-lg">
                <span className="font-sans font-medium text-slate-800">{m.month}</span>
                <span className="text-emerald-600 font-bold">{m.เสี่ยงต่ำ} คน</span>
                <span className="text-amber-600 font-bold">{m.เสี่ยงปานกลาง} คน</span>
                <span className="text-rose-600 font-bold">{m.เสี่ยงสูง} คน</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
