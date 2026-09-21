import React from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
} from 'recharts';
import { HealthRecord } from '../types';
import { 
  getRiskDistributionData, 
  getRiskByAgeData, 
  getRiskByGenderData, 
  getRiskByAreaData 
} from '../utils/calculations';

interface HealthRiskSectionProps {
  records: HealthRecord[];
}

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ records }) => {
  const riskDist = getRiskDistributionData(records);
  const riskByAge = getRiskByAgeData(records);
  const riskByGender = getRiskByGenderData(records);
  const riskByArea = getRiskByAreaData(records);

  const total = records.length || 1;

  // Custom Pie Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-rose-100 text-xs">
          <p className="font-bold text-slate-800 mb-1">{data.name}</p>
          <p className="text-slate-600">
            จำนวน: <strong className="font-bold text-slate-900">{data.count} คน</strong>
          </p>
          <p className="text-rose-600 font-semibold">
            คิดเป็น: {data.percent}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-rose-100 text-xs min-w-[140px]">
          <p className="font-bold text-slate-800 mb-1.5 pb-1 border-b border-rose-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
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
    <section id="health-risk" className="mb-8 scroll-mt-28">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm shadow-rose-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Health Risk Analysis (การวิเคราะห์ระดับความเสี่ยง)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                4 มิติการวิเคราะห์
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์กลุ่มเสี่ยงต่ำ ปานกลาง และสูง จำแนกตามอายุ เพศ และพื้นที่ (แสดงตัวเลขกำกับทุกกราฟ)
            </p>
          </div>
        </div>
      </div>

      {/* 4 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Overall Risk Distribution (Donut Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>1. จำนวนกลุ่มเสี่ยงโดยรวม (ต่ำ / ปานกลาง / สูง)</span>
              </h3>
              <p className="text-xs text-slate-500">สัดส่วนผู้เข้ารับการประเมินตามเกณฑ์ความเสี่ยง</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-rose-50 text-rose-700 px-2 py-1 rounded-lg">
              รวม {records.length} คน
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={riskDist}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  label={(props: any) => `${props.name} ${props.payload?.count || 0} คน (${props.payload?.percent || 0}%)`}
                  labelLine={{ stroke: '#f43f5e', strokeWidth: 1 }}
                >
                  {riskDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Numerical Summary Chips underneath */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-rose-50 mt-2">
            {riskDist.map((item) => (
              <div 
                key={item.name} 
                className="p-2.5 rounded-2xl border text-center transition-all"
                style={{ backgroundColor: item.lightColor, borderColor: `${item.color}33` }}
              >
                <div className="text-[11px] font-semibold text-slate-600 truncate">{item.name}</div>
                <div className="text-lg font-bold font-mono my-0.5" style={{ color: item.color }}>
                  {item.count} <span className="text-xs font-normal text-slate-500">คน</span>
                </div>
                <div className="text-[10px] font-medium text-slate-500">
                  {item.percent}% ของกลุ่ม
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Risk by Age Group (Stacked Bar Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>2. กลุ่มเสี่ยงตามช่วงอายุ</span>
              </h3>
              <p className="text-xs text-slate-500">การกระจายตัวของระดับความเสี่ยงในแต่ละช่วงวัย</p>
            </div>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByAge} margin={{ top: 20, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} opacity={0.6} />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="ต่ำ" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]}>
                  <LabelList dataKey="ต่ำ" position="center" fill="#ffffff" fontSize={10} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="ปานกลาง" fill="#f59e0b" stackId="a">
                  <LabelList dataKey="ปานกลาง" position="center" fill="#ffffff" fontSize={10} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="สูง" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="สูง" position="center" fill="#ffffff" fontSize={10} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? v : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Note */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-rose-50 mt-2">
            <span>สังเกต: กลุ่มอายุ 60 ปีขึ้นไป มักมีสัดส่วนกลุ่มเสี่ยงสูงมากที่สุด</span>
            <span className="text-[11px] font-mono text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
              4 ช่วงอายุ
            </span>
          </div>
        </div>

        {/* 3. Risk by Gender (Grouped Bar Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>3. กลุ่มเสี่ยงตามเพศ (ชาย vs หญิง)</span>
              </h3>
              <p className="text-xs text-slate-500">เปรียบเทียบระดับความเสี่ยงระหว่างเพศชายและเพศหญิง</p>
            </div>
            <UserCheck className="w-4 h-4 text-rose-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByGender} margin={{ top: 20, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} opacity={0.6} />
                <XAxis dataKey="gender" tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="ต่ำ" fill="#10b981" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="ต่ำ" position="top" fill="#10b981" fontSize={11} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? `${v} คน` : ''} />
                </Bar>
                <Bar dataKey="ปานกลาง" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="ปานกลาง" position="top" fill="#f59e0b" fontSize={11} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? `${v} คน` : ''} />
                </Bar>
                <Bar dataKey="สูง" fill="#ef4444" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="สูง" position="top" fill="#ef4444" fontSize={11} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? `${v} คน` : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rose-50 mt-2 text-xs">
            {riskByGender.map(g => (
              <div key={g.gender} className="bg-slate-50/80 p-2 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-slate-700">เพศ{g.gender} (รวม {g.รวม} คน):</span>
                <span className="font-mono text-slate-600">
                  <span className="text-emerald-600">ต่ำ {g.ต่ำ}</span> | <span className="text-amber-600">กลาง {g.ปานกลาง}</span> | <span className="text-rose-600 font-bold">สูง {g.สูง}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Risk by Area (Horizontal or Stacked Bar Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40">
          <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>4. กลุ่มเสี่ยงตามพื้นที่ (5 เขตพื้นที่)</span>
              </h3>
              <p className="text-xs text-slate-500">จำแนกระดับความเสี่ยงตามพื้นที่ เมือง เหนือ ตะวันออก ตะวันตก ใต้</p>
            </div>
            <MapPin className="w-4 h-4 text-rose-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByArea} margin={{ top: 20, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} opacity={0.6} />
                <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="ต่ำ" fill="#10b981" stackId="b">
                  <LabelList dataKey="ต่ำ" position="center" fill="#ffffff" fontSize={10} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="ปานกลาง" fill="#f59e0b" stackId="b">
                  <LabelList dataKey="ปานกลาง" position="center" fill="#ffffff" fontSize={10} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? v : ''} />
                </Bar>
                <Bar dataKey="สูง" fill="#ef4444" stackId="b" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="สูง" position="center" fill="#ffffff" fontSize={10} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? v : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-rose-50 mt-2 overflow-x-auto">
            {riskByArea.map(a => (
              <span key={a.area} className="px-2 py-1 bg-slate-50 rounded-lg text-[11px] whitespace-nowrap">
                <strong>{a.area}:</strong> สูง {a.สูง} / รวม {a.รวม}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
