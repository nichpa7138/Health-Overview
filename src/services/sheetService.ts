import { HealthRecord, RiskLevel } from '../types';
import { FALLBACK_HEALTH_DATA } from '../data/fallbackData';

export const GOOGLE_SHEET_ID = '1_IskqrTzM9KDPL-Gu8V0cYRKpZYc1ro3J0z5th9isr4';
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;
export const SHEET_WEB_LINK = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentVal += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        currentRow.push(currentVal.trim());
        if (currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += c;
      }
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export async function fetchHealthRecords(): Promise<{
  data: HealthRecord[];
  isLive: boolean;
  lastUpdated: string;
  source: string;
  error?: string;
}> {
  try {
    const response = await fetch(SHEET_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*'
      },
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    if (!csvText || csvText.trim().length === 0 || csvText.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid CSV response from Google Sheets');
    }

    const rows = parseCSV(csvText);
    if (rows.length <= 1) {
      throw new Error('CSV has no data rows');
    }

    const dataRows = rows.slice(1);
    const records: HealthRecord[] = dataRows
      .filter(r => r.length >= 5 && r[0] && r[0].startsWith('H'))
      .map(r => {
        const rawRisk = (r[18] || '').trim();
        let riskLevel: RiskLevel = 'ต่ำ';
        if (rawRisk.includes('สูง')) riskLevel = 'สูง';
        else if (rawRisk.includes('ปานกลาง')) riskLevel = 'ปานกลาง';

        return {
          id: r[0] || 'Unknown',
          date: r[1] || '',
          area: r[2] || 'ไม่ระบุ',
          gender: r[3] || 'ไม่ระบุ',
          age: Number(r[4]) || 0,
          height: Number(r[5]) || 0,
          weight: Number(r[6]) || 0,
          bmi: Number(r[7]) || 0,
          sbp: Number(r[8]) || 0,
          dbp: Number(r[9]) || 0,
          pulse: Number(r[10]) || 0,
          sugar: Number(r[11]) || 0,
          smoking: (r[12] || 'ไม่สูบ').trim(),
          alcohol: (r[13] || 'ไม่ดื่ม').trim(),
          exercise: (r[14] || 'ไม่ออกกำลังกาย').trim(),
          diabetesRisk: (r[15] || 'ไม่มี').trim(),
          hypertensionRisk: (r[16] || 'ไม่มี').trim(),
          riskScore: Number(r[17]) || 0,
          riskLevel,
          month: (r[19] || '').trim() || '2026-01'
        };
      });

    if (records.length === 0) {
      throw new Error('Parsed 0 valid records');
    }

    return {
      data: records,
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString('th-TH', { hour12: false }),
      source: 'Google Sheets (Live Sync)'
    };
  } catch (err: any) {
    console.warn('Live fetch failed, falling back to cached Google Sheet dataset:', err?.message);
    return {
      data: FALLBACK_HEALTH_DATA,
      isLive: false,
      lastUpdated: new Date().toLocaleTimeString('th-TH', { hour12: false }),
      source: 'Google Sheet ID 1_IskqrTzM9KDPL-Gu8V0cYRKpZYc1ro3J0z5th9isr4 (สำรองในตัว)',
      error: err?.message
    };
  }
}
