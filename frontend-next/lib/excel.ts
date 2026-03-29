// Este archivo solo corre en el browser (importado desde Client Components)
import * as XLSX from 'xlsx';
import { ExcelRow } from './types';

/**
 * Lee un archivo Excel y retorna los headers y filas como objetos.
 * Portado directamente de LocalExcelService.readFile()
 */
export function readFile(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ headers: string[]; rows: ExcelRow[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        // FileReader cubre 0–60 %
        onProgress?.(Math.round((e.loaded / e.total) * 60));
      }
    };

    reader.onload = (e) => {
      onProgress?.(65);
      const data = e.target?.result;

      // setTimeout(0) cede el hilo al browser para que re-pinte antes de parsear
      setTimeout(() => {
        try {
          const workbook = XLSX.read(data, { type: 'array' });
          onProgress?.(82);

          setTimeout(() => {
            try {
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
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

/**
 * Retorna los valores únicos de una columna dada, ordenados alfabéticamente.
 * Portado directamente de LocalExcelService.getUniqueValues()
 */
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
