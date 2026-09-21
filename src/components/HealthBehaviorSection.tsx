import React from 'react';
import { 
  Activity, 
  Cigarette, 
  Wine, 
  Dumbbell, 
  HeartCrack, 
  Droplet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList
} from 'recharts';
import { HealthRecord } from '../types';
import { getBehaviorData } from '../utils/calculations';

interface HealthBehaviorSectionProps {
  records: HealthRecord[];
}

export const HealthBehaviorSection: React.FC<HealthBehaviorSectionProps> = ({ records }) => {
  const behavior = getBehaviorData(records);
  const total = records.length || 1;

  // Custom Pie Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-rose-100 text-xs">
          <p className="font-bold text-slate-800 mb-1">{data.name}</p>
          <p className="text-slate-600">
            จำนวน: <strong className="font-bold text-slate-900">{data.value} คน</strong>
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
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-rose-100 text-xs min-w-[130px]">
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
    <section id="health-behavior" className="mb-8 scroll-mt-28">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm shadow-rose-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Health Behavior & Conditions (พฤติกรรมสุขภาพและภาวะเสี่ยง)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
                ปัจจัยเสี่ยง 5 ด้าน
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์พฤติกรรมการสูบบุหรี่ ดื่มสุรา การออกกำลังกาย และความเสี่ยงเบาหวาน/ความดันโลหิต
            </p>
          </div>
        </div>
      </div>

      {/* 3 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 1. Smoking & Alcohol Comparison */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>1. สูบบุหรี่ & ดื่มแอลกอฮอล์</span>
                </h3>
                <p className="text-xs text-slate-500">พฤติกรรมสารเสพติดและแอลกอฮอล์</p>
              </div>
              <div className="flex gap-1">
                <Cigarette className="w-4 h-4 text-rose-500" />
                <Wine className="w-4 h-4 text-pink-500" />
              </div>
            </div>

            {/* Smoking row */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Cigarette className="w-3.5 h-3.5 text-rose-500" /> สูบบุหรี่:
                </span>
                <span className="font-mono text-slate-700">
                  <strong className="text-rose-600">{behavior.smoking.find(s => s.name === 'สูบบุหรี่')?.value || 0} คน</strong>
                  <span className="text-slate-400"> / {total} คน ({behavior.smoking.find(s => s.name === 'สูบบุหรี่')?.percent || 0}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${behavior.smoking.find(s => s.name === 'สูบบุหรี่')?.percent || 0}%` }} 
                  className="bg-rose-500 h-full"
                  title="สูบบุหรี่"
                />
                <div 
                  style={{ width: `${behavior.smoking.find(s => s.name === 'ไม่สูบ')?.percent || 0}%` }} 
                  className="bg-emerald-400 h-full"
                  title="ไม่สูบ"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span className="text-rose-600 font-medium">สูบ {behavior.smoking.find(s => s.name === 'สูบบุหรี่')?.value} คน</span>
                <span className="text-emerald-600 font-medium">ไม่สูบ {behavior.smoking.find(s => s.name === 'ไม่สูบ')?.value} คน</span>
              </div>
            </div>

            {/* Alcohol row */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Wine className="w-3.5 h-3.5 text-pink-500" /> ดื่มแอลกอฮอล์:
                </span>
                <span className="font-mono text-slate-700">
                  <strong className="text-pink-600">{behavior.alcohol.find(a => a.name === 'ดื่มแอลกอฮอล์')?.value || 0} คน</strong>
                  <span className="text-slate-400"> / {total} คน ({behavior.alcohol.find(a => a.name === 'ดื่มแอลกอฮอล์')?.percent || 0}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${behavior.alcohol.find(a => a.name === 'ดื่มแอลกอฮอล์')?.percent || 0}%` }} 
                  className="bg-pink-500 h-full"
                  title="ดื่มแอลกอฮอล์"
                />
                <div 
                  style={{ width: `${behavior.alcohol.find(a => a.name === 'ไม่ดื่ม')?.percent || 0}%` }} 
                  className="bg-emerald-400 h-full"
                  title="ไม่ดื่ม"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span className="text-pink-600 font-medium">ดื่ม {behavior.alcohol.find(a => a.name === 'ดื่มแอลกอฮอล์')?.value} คน</span>
                <span className="text-emerald-600 font-medium">ไม่ดื่ม {behavior.alcohol.find(a => a.name === 'ไม่ดื่ม')?.value} คน</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-rose-50 mt-4 text-[11px] text-slate-500">
            พฤติกรรมสูบบุหรี่และดื่มสุราเป็นปัจจัยเร่งความดันโลหิตและโรคหลอดเลือดหัวใจ
          </div>
        </div>

        {/* 2. Exercise Habits (Donut / Pie Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>2. การออกกำลังกาย</span>
                </h3>
                <p className="text-xs text-slate-500">ความถี่ในการทำกิจกรรมทางกาย</p>
              </div>
              <Dumbbell className="w-4 h-4 text-rose-400" />
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={behavior.exercise}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={4}
                    label={({ name, value }) => `${name} ${value} คน`}
                    labelLine={{ stroke: '#f43f5e', strokeWidth: 1 }}
                  >
                    {behavior.exercise.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Exercise Breakdown */}
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {behavior.exercise.map((ex) => (
                <div key={ex.name} className="bg-slate-50 p-1.5 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] text-slate-600 block truncate">{ex.name}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: ex.color }}>
                    {ex.value} คน
                  </span>
                  <span className="text-[10px] text-slate-400 block">({ex.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-rose-50 mt-4 text-[11px] text-slate-500">
            ผู้ไม่ออกกำลังกายควรได้รับคำแนะนำเพื่อเพิ่มการเคลื่อนไหวอย่างน้อย 150 นาที/สัปดาห์
          </div>
        </div>

        {/* 3. Diabetes & Hypertension Risks (Comparison Bar Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm shadow-rose-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-50 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>3. เบาหวาน & ความดันโลหิต</span>
                </h3>
                <p className="text-xs text-slate-500">ผลการคัดกรองความเสี่ยงโรคเรื้อรัง NCDs</p>
              </div>
              <HeartCrack className="w-4 h-4 text-rose-500" />
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behavior.conditions} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" vertical={false} opacity={0.6} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} allowDecimals={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    wrapperStyle={{ paddingBottom: '4px', fontSize: '11px' }}
                  />
                  <Bar dataKey="ปกติ" fill="#10b981" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="ปกติ" position="top" fill="#10b981" fontSize={11} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? `${v} คน` : ''} />
                  </Bar>
                  <Bar dataKey="เสี่ยง" fill="#ef4444" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="เสี่ยง" position="top" fill="#ef4444" fontSize={11} fontWeight={700} formatter={(v: any) => Number(v) > 0 ? `${v} คน` : ''} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Conditions Risk Percentage */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {behavior.conditions.map((c) => (
                <div key={c.category} className="bg-rose-50/60 p-2 rounded-xl text-center border border-rose-100">
                  <span className="text-[11px] font-semibold text-slate-700 block">เสี่ยง{c.category}</span>
                  <span className="text-sm font-bold text-rose-600 font-mono">{c.เสี่ยง} คน</span>
                  <span className="text-[10px] text-rose-700 font-medium block">({c.percentRisk}% ของกลุ่ม)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-rose-50 mt-4 text-[11px] text-slate-500">
            กลุ่มที่พบผลคัดกรอง "มีแนวโน้ม/เสี่ยง" ควรส่งต่อพบแพทย์เพื่อตรวจยืนยัน
          </div>
        </div>

      </div>
    </section>
  );
};
