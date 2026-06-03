// Este archivo solo corre en el browser (importado desde Client Components)
import * as XLSX from 'xlsx';
import { ExcelRow } from './types';

function readArrayBuffer(file: File, onProgress?: (percent: number) => void): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 60));
    };
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export async function getSheetNames(file: File): Promise<string[]> {
  const buffer = await readArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  return workbook.SheetNames;
}

export function readFile(
  file: File,
  onProgress?: (percent: number) => void,
  sheetName?: string,
): Promise<{ headers: string[]; rows: ExcelRow[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 60));
    };

    reader.onload = (e) => {
      onProgress?.(65);
      const data = e.target?.result;

      setTimeout(() => {
        try {
          const workbook = XLSX.read(data, { type: 'array' });
          onProgress?.(82);

          setTimeout(() => {
            try {
              const sheet = sheetName ?? workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheet];
              const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as ExcelRow[];
              const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
              onProgress?.(100);
              resolve({ headers, rows });
            } catch (err) {
              reject(err);
            }
          }, 0);
        } catch (err) {
          reject(err);
        }
      }, 0);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export function getUniqueValues(rows: ExcelRow[], header: string): string[] {
  const seen = new Set<string>();
  for (const row of rows) {
    const val = row[header];
    if (val !== null && val !== undefined && val !== '') {
      seen.add(String(val));
    }
  }
  return Array.from(seen).sort();
}
