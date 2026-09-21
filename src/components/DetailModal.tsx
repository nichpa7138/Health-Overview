import React from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Calendar, 
  Scale, 
  Activity, 
  Droplet, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Cigarette,
  Wine,
  Dumbbell,
  Heart,
  FileText
} from 'lucide-react';
import { HealthRecord } from '../types';

interface DetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const getRiskColor = (level: string) => {
    if (level === 'สูง') return { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', bar: 'border-l-red-500' };
    if (level === 'ปานกลาง') return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', bar: 'border-l-amber-500' };
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bar: 'border-l-emerald-500' };
  };

  const riskColor = getRiskColor(record.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-rose-100 overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Risk Bar */}
        <div className={`p-6 border-b border-rose-100/80 bg-gradient-to-r from-rose-50/70 to-pink-50/40 flex items-start justify-between relative`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-mono font-bold text-lg shadow-md shadow-rose-200">
              {record.id.slice(0, 5)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  รหัสบุคคล: <span className="font-mono text-rose-600">{record.id}</span>
                </h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${riskColor.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${riskColor.dot}`}></span>
                  ความเสี่ยง{record.riskLevel} (คะแนน {record.riskScore})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-400" /> วันที่: {record.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-400" /> พื้นที่: {record.area}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-rose-100 text-slate-400 hover:text-slate-700 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Demographics & Body Metrics */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500" /> ข้อมูลทั่วไปและดัชนีทางกายภาพ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block">เพศ / อายุ</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {record.gender} / {record.age} ปี
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block">ส่วนสูง / น้ำหนัก</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {record.height} cm / {record.weight} kg
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block">BMI (ดัชนีมวลกาย)</span>
                <span className="text-base font-bold text-rose-600 font-mono">
                  {record.bmi} <span className="text-xs font-normal text-slate-500">kg/m²</span>
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block">ชีพจร</span>
                <span className="text-base font-bold text-purple-600 font-mono">
                  {record.pulse} <span className="text-xs font-normal text-slate-500">bpm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Vital Signs */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-500" /> สัญญาณชีพและผลตรวจทางห้องปฏิบัติการ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600 block">ความดันโลหิต (SBP / DBP)</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                    {record.sbp} / {record.dbp} <span className="text-xs font-normal text-slate-500">mmHg</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {record.sbp >= 140 || record.dbp >= 90 
                      ? '⚠️ เข้าเกณฑ์ความดันโลหิตสูง' 
                      : record.sbp >= 120 
                        ? '⚡ ความดันเริ่มสูง (Pre-HT)' 
                        : '✅ ความดันปกติ'}
                  </span>
                </div>
                <Activity className="w-8 h-8 text-rose-400" />
              </div>

              <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600 block">ระดับน้ำตาลในเลือด (FBS)</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                    {record.sugar} <span className="text-xs font-normal text-slate-500">mg/dL</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {record.sugar >= 126 
                      ? '⚠️ ค่าเสี่ยงโรคเบาหวาน' 
                      : record.sugar >= 100 
                        ? '⚡ เสี่ยงเบาหวาน (Prediabetes)' 
                        : '✅ ระดับน้ำตาลปกติ'}
                  </span>
                </div>
                <Droplet className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Lifestyle & Disease Risks */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> พฤติกรรมสุขภาพและผลคัดกรองโรคเรื้อรัง
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <Cigarette className="w-3.5 h-3.5 text-rose-500" /> สูบบุหรี่
                </span>
                <span className={`text-sm font-bold ${record.smoking === 'สูบ' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {record.smoking}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <Wine className="w-3.5 h-3.5 text-pink-500" /> ดื่มแอลกอฮอล์
                </span>
                <span className={`text-sm font-bold ${record.alcohol === 'ดื่ม' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {record.alcohol}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <Dumbbell className="w-3.5 h-3.5 text-amber-500" /> การออกกำลังกาย
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {record.exercise}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">คัดกรองเบาหวาน</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block ${
                  record.diabetesRisk.includes('เสี่ยง') ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {record.diabetesRisk}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">คัดกรองความดันสูง</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block ${
                  record.hypertensionRisk.includes('เสี่ยง') ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {record.hypertensionRisk}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">เดือนที่คัดกรอง</span>
                <span className="text-xs font-bold font-mono text-slate-700">
                  {record.month}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations based on risk */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
            <h5 className="text-xs font-bold text-rose-900 mb-1 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" /> คำแนะนำทางสาธารณสุข
            </h5>
            <p className="text-xs text-rose-800 leading-relaxed">
              {record.riskLevel === 'สูง' && 'ผู้รับการตรวจจัดอยู่ในกลุ่มเสี่ยงสูง ควรส่งต่อพบแพทย์เพื่อวินิจฉัยอย่างละเอียด ติดตามวัดความดันโลหิตและระดับน้ำตาลสะสม (HbA1c) พร้อมปรับพฤติกรรมงดบุหรี่/สุราทันที'}
              {record.riskLevel === 'ปานกลาง' && 'ผู้รับการตรวจจัดอยู่ในกลุ่มเสี่ยงปานกลาง ควรได้รับการให้คำปรึกษาปรับเปลี่ยนพฤติกรรม (Life Style Modification) ลดอาหารหวานมันเค็ม ออกกำลังกายสม่ำเสมอ และนัดตรวจซ้ำใน 3-6 เดือน'}
              {record.riskLevel === 'ต่ำ' && 'สุขภาพอยู่ในเกณฑ์ดี แนะนำรักษาระดับการออกกำลังกายสม่ำเสมอ ทานอาหารตามหลักโภชนาการ และเข้ารับการตรวจคัดกรองประจำปีอย่างต่อเนื่อง'}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
