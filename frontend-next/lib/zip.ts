// Este archivo solo corre en el browser (importado desde Client Components)
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { FilterConfig } from './types';

/**
 * Sanitiza un string para usarlo como nombre de archivo.
 * Portado directamente de LocalExcelService.sanitizeName()
 */
function sanitizeName(name: string): string {
  return String(name).replace(/[\\/:*?"<>|]/g, '_').trim();
}

/**
 * Genera múltiples archivos Excel divididos por los valores únicos de una columna,
 * aplica filtros opcionales, selecciona columnas, y descarga todo en un ZIP.
 * Portado directamente de LocalExcelService.generateAndDownloadZip()
 */
export async function generateAndDownloadZip(
  rows: Record<string, any>[],
  separateBy: string,
  filter: FilterConfig | null,
  keepCols: string[],
  baseName: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  // 1. Aplicar filtro de filas si existe
  let filteredRows = rows;
  if (filter && filter.header && filter.values.length > 0) {
    filteredRows = rows.filter((row) => filter.values.includes(String(row[filter.header])));
  }

  // 2. Agrupar por valores únicos de la columna de separación
  const groups = new Map<string, Record<string, any>[]>();
  for (const row of filteredRows) {
    const key = String(row[separateBy] ?? '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  // 3. Seleccionar columnas a mantener
  const colsToKeep = keepCols.length > 0 ? keepCols : Object.keys(rows[0] ?? {});

  // 4. Generar archivos Excel y agregarlos al ZIP
  const zip = new JSZip();
  const usedNames = new Map<string, number>();

  for (const [value, groupRows] of groups) {
    if (groupRows.length === 0) continue;

    // Proyectar columnas
    const projected = groupRows.map((row) => {
      const out: Record<string, any> = {};
      for (const col of colsToKeep) {
        out[col] = row[col] ?? '';
      }
      return out;
    });

    // Nombre del archivo
    const sanitizedBase = sanitizeName(baseName);
    const sanitizedCol = sanitizeName(separateBy);
    const sanitizedValue = sanitizeName(value);
    let fileName = `${sanitizedBase} - ${sanitizedCol} - ${sanitizedValue}`;

    // Manejar duplicados con sufijos
    if (usedNames.has(fileName)) {
      const count = usedNames.get(fileName)! + 1;
      usedNames.set(fileName, count);
      fileName = `${fileName} (${count})`;
    } else {
      usedNames.set(fileName, 0);
    }

    // Crear workbook y convertir a array buffer
    const ws = XLSX.utils.json_to_sheet(projected);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const xlsxBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

    zip.file(`${fileName}.xlsx`, xlsxBuffer);
  }

  // 5. Generar ZIP y disparar descarga
  const zipBlob = await zip.generateAsync(
    { type: 'blob' },
    onProgress ? (meta) => onProgress(Math.round(meta.percent)) : undefined
  );
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeName(baseName)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
