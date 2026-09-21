import { HealthRecord, SummaryStats, FilterState } from '../types';

export function filterRecords(records: HealthRecord[], filters: FilterState): HealthRecord[] {
  return records.filter(item => {
    // Area
    if (filters.area !== 'ทั้งหมด' && item.area !== filters.area) {
      return false;
    }
    // Gender
    if (filters.gender !== 'ทั้งหมด' && item.gender !== filters.gender) {
      return false;
    }
    // Age Group
    if (filters.ageGroup !== 'ทั้งหมด') {
      if (filters.ageGroup === '<35' && item.age >= 35) return false;
      if (filters.ageGroup === '35-49' && (item.age < 35 || item.age > 49)) return false;
      if (filters.ageGroup === '50-59' && (item.age < 50 || item.age > 59)) return false;
      if (filters.ageGroup === '60+' && item.age < 60) return false;
    }
    // Risk Level
    if (filters.riskLevel !== 'ทั้งหมด' && item.riskLevel !== filters.riskLevel) {
      return false;
    }
    // Smoking
    if (filters.smoking !== 'ทั้งหมด' && item.smoking !== filters.smoking) {
      return false;
    }
    // Alcohol
    if (filters.alcohol !== 'ทั้งหมด' && item.alcohol !== filters.alcohol) {
      return false;
    }
    // Search Query (ID, Area, Date)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchId = item.id.toLowerCase().includes(q);
      const matchArea = item.area.toLowerCase().includes(q);
      const matchDate = item.date.toLowerCase().includes(q);
      if (!matchId && !matchArea && !matchDate) return false;
    }
    return true;
  });
}

export function computeSummaryStats(records: HealthRecord[]): SummaryStats {
  const total = records.length;
  if (total === 0) {
    return {
      total: 0,
      maleCount: 0,
      femaleCount: 0,
      maleRatio: 0,
      femaleRatio: 0,
      avgAge: 0,
      minAge: 0,
      maxAge: 0,
      avgBmi: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgSugar: 0,
      avgPulse: 0,
      lowRiskCount: 0,
      midRiskCount: 0,
      highRiskCount: 0,
      smokerCount: 0,
      drinkerCount: 0,
      diabetesRiskCount: 0,
      hypertensionRiskCount: 0
    };
  }

  let maleCount = 0;
  let femaleCount = 0;
  let totalAge = 0;
  let minAge = records[0].age;
  let maxAge = records[0].age;
  let totalBmi = 0;
  let totalSbp = 0;
  let totalDbp = 0;
  let totalSugar = 0;
  let totalPulse = 0;
  let lowRiskCount = 0;
  let midRiskCount = 0;
  let highRiskCount = 0;
  let smokerCount = 0;
  let drinkerCount = 0;
  let diabetesRiskCount = 0;
  let hypertensionRiskCount = 0;

  for (const r of records) {
    if (r.gender === 'ชาย') maleCount++;
    if (r.gender === 'หญิง') femaleCount++;

    totalAge += r.age;
    if (r.age < minAge) minAge = r.age;
    if (r.age > maxAge) maxAge = r.age;

    totalBmi += r.bmi;
    totalSbp += r.sbp;
    totalDbp += r.dbp;
    totalSugar += r.sugar;
    totalPulse += r.pulse;

    if (r.riskLevel === 'ต่ำ') lowRiskCount++;
    else if (r.riskLevel === 'ปานกลาง') midRiskCount++;
    else if (r.riskLevel === 'สูง') highRiskCount++;

    if (r.smoking === 'สูบ') smokerCount++;
    if (r.alcohol === 'ดื่ม') drinkerCount++;
    if (r.diabetesRisk.includes('เสี่ยง')) diabetesRiskCount++;
    if (r.hypertensionRisk.includes('เสี่ยง')) hypertensionRiskCount++;
  }

  return {
    total,
    maleCount,
    femaleCount,
    maleRatio: Math.round((maleCount / total) * 1000) / 10,
    femaleRatio: Math.round((femaleCount / total) * 1000) / 10,
    avgAge: Math.round((totalAge / total) * 10) / 10,
    minAge,
    maxAge,
    avgBmi: Math.round((totalBmi / total) * 10) / 10,
    avgSbp: Math.round((totalSbp / total) * 10) / 10,
    avgDbp: Math.round((totalDbp / total) * 10) / 10,
    avgSugar: Math.round((totalSugar / total) * 10) / 10,
    avgPulse: Math.round((totalPulse / total) * 10) / 10,
    lowRiskCount,
    midRiskCount,
    highRiskCount,
    smokerCount,
    drinkerCount,
    diabetesRiskCount,
    hypertensionRiskCount
  };
}

// Chart Data aggregators
export function getRiskDistributionData(records: HealthRecord[]) {
  const total = records.length || 1;
  let low = 0, mid = 0, high = 0;
  for (const r of records) {
    if (r.riskLevel === 'ต่ำ') low++;
    else if (r.riskLevel === 'ปานกลาง') mid++;
    else if (r.riskLevel === 'สูง') high++;
  }
  return [
    { name: 'ความเสี่ยงต่ำ', count: low, percent: Math.round((low / total) * 100), color: '#10b981', lightColor: '#ecfdf5' },
    { name: 'ความเสี่ยงปานกลาง', count: mid, percent: Math.round((mid / total) * 100), color: '#f59e0b', lightColor: '#fffbeb' },
    { name: 'ความเสี่ยงสูง', count: high, percent: Math.round((high / total) * 100), color: '#ef4444', lightColor: '#fef2f2' }
  ];
}

export function getRiskByAgeData(records: HealthRecord[]) {
  const groups = [
    { key: '<35', label: '< 35 ปี' },
    { key: '35-49', label: '35 - 49 ปี' },
    { key: '50-59', label: '50 - 59 ปี' },
    { key: '60+', label: '60 ปีขึ้นไป' }
  ];

  return groups.map(g => {
    let low = 0, mid = 0, high = 0;
    for (const r of records) {
      let match = false;
      if (g.key === '<35' && r.age < 35) match = true;
      else if (g.key === '35-49' && r.age >= 35 && r.age <= 49) match = true;
      else if (g.key === '50-59' && r.age >= 50 && r.age <= 59) match = true;
      else if (g.key === '60+' && r.age >= 60) match = true;

      if (match) {
        if (r.riskLevel === 'ต่ำ') low++;
        else if (r.riskLevel === 'ปานกลาง') mid++;
        else if (r.riskLevel === 'สูง') high++;
      }
    }
    const total = low + mid + high;
    return {
      ageGroup: g.label,
      ต่ำ: low,
      ปานกลาง: mid,
      สูง: high,
      รวม: total
    };
  });
}

export function getRiskByGenderData(records: HealthRecord[]) {
  const genders = ['ชาย', 'หญิง'];
  return genders.map(gender => {
    let low = 0, mid = 0, high = 0;
    for (const r of records) {
      if (r.gender === gender) {
        if (r.riskLevel === 'ต่ำ') low++;
        else if (r.riskLevel === 'ปานกลาง') mid++;
        else if (r.riskLevel === 'สูง') high++;
      }
    }
    return {
      gender,
      ต่ำ: low,
      ปานกลาง: mid,
      สูง: high,
      รวม: low + mid + high
    };
  });
}

export function getRiskByAreaData(records: HealthRecord[]) {
  const areas = ['เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'];
  return areas.map(area => {
    let low = 0, mid = 0, high = 0;
    for (const r of records) {
      if (r.area === area) {
        if (r.riskLevel === 'ต่ำ') low++;
        else if (r.riskLevel === 'ปานกลาง') mid++;
        else if (r.riskLevel === 'สูง') high++;
      }
    }
    return {
      area,
      ต่ำ: low,
      ปานกลาง: mid,
      สูง: high,
      รวม: low + mid + high
    };
  });
}

export function getMonthlyTrendData(records: HealthRecord[]) {
  const months = [
    { key: '2026-01', label: 'ม.ค. 2569' },
    { key: '2026-02', label: 'ก.พ. 2569' },
    { key: '2026-03', label: 'มี.ค. 2569' }
  ];

  return months.map(m => {
    let total = 0, low = 0, mid = 0, high = 0;
    for (const r of records) {
      if (r.month === m.key) {
        total++;
        if (r.riskLevel === 'ต่ำ') low++;
        else if (r.riskLevel === 'ปานกลาง') mid++;
        else if (r.riskLevel === 'สูง') high++;
      }
    }
    return {
      month: m.label,
      ผู้คัดกรอง: total,
      เสี่ยงต่ำ: low,
      เสี่ยงปานกลาง: mid,
      เสี่ยงสูง: high
    };
  });
}

export function getBehaviorData(records: HealthRecord[]) {
  const total = records.length || 1;
  let smokers = 0, nonSmokers = 0;
  let drinkers = 0, nonDrinkers = 0;
  let exerciseRegular = 0, exerciseSometimes = 0, exerciseNone = 0;
  let diabetesRisk = 0, diabetesNormal = 0;
  let hypertensionRisk = 0, hypertensionNormal = 0;

  for (const r of records) {
    if (r.smoking === 'สูบ') smokers++; else nonSmokers++;
    if (r.alcohol === 'ดื่ม') drinkers++; else nonDrinkers++;
    if (r.exercise === 'สม่ำเสมอ') exerciseRegular++;
    else if (r.exercise === 'บางครั้ง') exerciseSometimes++;
    else exerciseNone++;

    if (r.diabetesRisk.includes('เสี่ยง')) diabetesRisk++; else diabetesNormal++;
    if (r.hypertensionRisk.includes('เสี่ยง')) hypertensionRisk++; else hypertensionNormal++;
  }

  return {
    smoking: [
      { name: 'ไม่สูบ', value: nonSmokers, percent: Math.round((nonSmokers / total) * 100), color: '#10b981' },
      { name: 'สูบบุหรี่', value: smokers, percent: Math.round((smokers / total) * 100), color: '#f43f5e' }
    ],
    alcohol: [
      { name: 'ไม่ดื่ม', value: nonDrinkers, percent: Math.round((nonDrinkers / total) * 100), color: '#10b981' },
      { name: 'ดื่มแอลกอฮอล์', value: drinkers, percent: Math.round((drinkers / total) * 100), color: '#fb7185' }
    ],
    exercise: [
      { name: 'สม่ำเสมอ', value: exerciseRegular, percent: Math.round((exerciseRegular / total) * 100), color: '#10b981' },
      { name: 'บางครั้ง', value: exerciseSometimes, percent: Math.round((exerciseSometimes / total) * 100), color: '#f59e0b' },
      { name: 'ไม่ออกกำลังกาย', value: exerciseNone, percent: Math.round((exerciseNone / total) * 100), color: '#ef4444' }
    ],
    conditions: [
      {
        category: 'เบาหวาน',
        ปกติ: diabetesNormal,
        เสี่ยง: diabetesRisk,
        percentRisk: Math.round((diabetesRisk / total) * 100)
      },
      {
        category: 'ความดันโลหิต',
        ปกติ: hypertensionNormal,
        เสี่ยง: hypertensionRisk,
        percentRisk: Math.round((hypertensionRisk / total) * 100)
      }
    ]
  };
}
