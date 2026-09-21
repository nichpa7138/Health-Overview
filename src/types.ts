export type RiskLevel = 'ต่ำ' | 'ปานกลาง' | 'สูง';

export interface HealthRecord {
  id: string;
  date: string;
  area: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  sbp: number;
  dbp: number;
  pulse: number;
  sugar: number;
  smoking: string;
  alcohol: string;
  exercise: string;
  diabetesRisk: string;
  hypertensionRisk: string;
  riskScore: number;
  riskLevel: RiskLevel;
  month: string;
}

export interface FilterState {
  area: string;
  gender: string;
  ageGroup: string;
  riskLevel: string;
  smoking: string;
  alcohol: string;
  searchQuery: string;
}

export interface SummaryStats {
  total: number;
  maleCount: number;
  femaleCount: number;
  maleRatio: number;
  femaleRatio: number;
  avgAge: number;
  minAge: number;
  maxAge: number;
  avgBmi: number;
  avgSbp: number;
  avgDbp: number;
  avgSugar: number;
  avgPulse: number;
  lowRiskCount: number;
  midRiskCount: number;
  highRiskCount: number;
  smokerCount: number;
  drinkerCount: number;
  diabetesRiskCount: number;
  hypertensionRiskCount: number;
}
