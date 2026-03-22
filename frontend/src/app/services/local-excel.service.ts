import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

@Injectable({
	providedIn: 'root'
})
export class LocalExcelService {
	/**
	 * Lee un archivo Excel o CSV y retorna los headers y filas como objetos.
	 */
	readFile(file: File): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = e.target?.result;
					const workbook = XLSX.read(data, { type: 'array' });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];
					const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
					const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
					resolve({ headers, rows });
				} catch (err) {
					reject(err);
				}
			};
			reader.onerror = () => reject(reader.error);
			reader.readAsArrayBuffer(file);
		});
	}

	/**
	 * Retorna los valores únicos de una columna dada.
	 */
	getUniqueValues(rows: Record<string, any>[], header: string): string[] {
		const seen = new Set<string>();
		for (const row of rows) {
			const val = row[header];
			if (val !== null && val !== undefined && val !== '') {
				seen.add(String(val));
			}
		}
		return Array.from(seen).sort();
	}

	/**
	 * Sanitiza un string para usarlo como nombre de archivo (elimina caracteres inválidos).
	 */
	private sanitizeName(name: string): string {
		return String(name).replace(/[\\/:*?"<>|]/g, '_').trim();
	}

	/**
	 * Genera múltiples archivos Excel divididos por los valores únicos de una columna,
	 * aplica filtros opcionales, selecciona columnas, y descarga todo en un ZIP.
	 */
	async generateAndDownloadZip(
		rows: Record<string, any>[],
		separateBy: string,
		filter: { header: string; values: string[] } | null,
		keepCols: string[],
		baseName: string
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
			const sanitizedBase = this.sanitizeName(baseName);
			const sanitizedCol = this.sanitizeName(separateBy);
			const sanitizedValue = this.sanitizeName(value);
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
		const zipBlob = await zip.generateAsync({ type: 'blob' });
		const url = URL.createObjectURL(zipBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${this.sanitizeName(baseName)}.zip`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}
