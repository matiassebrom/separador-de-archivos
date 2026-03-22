import { Injectable, signal, computed } from '@angular/core';

export interface UploadedFileInfo {
	file_id: string;
	filename: string;
	message: string;
}

export interface FilterConfig {
	header: string;
	values: string[];
}

@Injectable({
	providedIn: 'root'
})
export class FileStateService {
	// Información del archivo
	private uploadedFile = signal<UploadedFileInfo | null>(null);

	// Filas del archivo (datos crudos)
	private _rows = signal<Record<string, any>[]>([]);
	rows = computed(() => this._rows());

	// Headers del archivo
	private _headers = signal<string[]>([]);
	headers = computed(() => this._headers());

	// Columna por la que se separa
	private _separateBy = signal<string>('');
	separateBy = computed(() => this._separateBy());

	// Filtro de filas (opcional)
	private _filter = signal<FilterConfig | null>(null);
	filter = computed(() => this._filter());

	// Columnas a mantener en la salida
	private _keepCols = signal<string[]>([]);
	keepCols = computed(() => this._keepCols());

	// Computed signals
	fileId = computed(() => this.uploadedFile()?.file_id ?? null);
	filename = computed(() => this.uploadedFile()?.filename ?? null);
	hasFile = computed(() => this.uploadedFile() !== null);

	// Nombre base para los archivos de salida
	private _baseName = signal<string>('');
	baseName = computed(() => this._baseName());

	setUploadedFile(fileInfo: UploadedFileInfo) {
		this.uploadedFile.set(fileInfo);
		const nameWithoutExt = fileInfo.filename.replace(/\.[^/.]+$/, '');
		this.setBaseName(nameWithoutExt);
	}

	setRows(rows: Record<string, any>[]) {
		this._rows.set(rows);
	}

	setHeaders(headers: string[]) {
		this._headers.set(headers);
	}

	setSeparateBy(header: string) {
		this._separateBy.set(header);
	}

	setFilter(filter: FilterConfig | null) {
		this._filter.set(filter);
	}

	setKeepCols(cols: string[]) {
		this._keepCols.set(cols);
	}

	setBaseName(name: string) {
		this._baseName.set(name);
	}

	getBaseName(): string {
		return this._baseName();
	}

	getCurrentFileId(): string | null {
		return this.fileId();
	}

	clearFile() {
		this.uploadedFile.set(null);
		this._rows.set([]);
		this._headers.set([]);
		this._separateBy.set('');
		this._filter.set(null);
		this._keepCols.set([]);
		this._baseName.set('');
	}
}
