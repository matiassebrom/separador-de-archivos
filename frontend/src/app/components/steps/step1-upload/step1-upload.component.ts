import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FileStateService } from '../../../services/file-state.service';
import { LocalExcelService } from '../../../services/local-excel.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-step1-upload',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
	templateUrl: './step1-upload.component.html',
	styleUrl: './step1-upload.component.scss'
})
export class Step1UploadComponent {
	@Input() fileUploaded = false;
	@Output() fileUpload = new EventEmitter<void>();

	selectedFile = signal<File | null>(null);
	isDragOver = signal(false);
	isUploading = signal(false);
	uploadStatus = signal<string>('');

	constructor(
		private localExcel: LocalExcelService,
		public fileStateService: FileStateService
	) {}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile.set(input.files[0]);
			this.uploadStatus.set('');
		} else {
			this.selectedFile.set(null);
		}
	}

	onFileDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			this.selectedFile.set(event.dataTransfer.files[0]);
			this.uploadStatus.set('');
		}
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(true);
	}

	onDragLeave(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
	}

	onFileUpload() {
		const file = this.selectedFile();
		if (!file) {
			this.uploadStatus.set('❌ No hay archivo seleccionado');
			return;
		}

		this.isUploading.set(true);
		this.uploadStatus.set('Procesando archivo...');

		this.localExcel
			.readFile(file)
			.then(({ headers, rows }) => {
				this.fileStateService.setRows(rows);
				this.fileStateService.setHeaders(headers);
				this.fileStateService.setUploadedFile({
					file_id: 'local',
					filename: file.name,
					message: `Archivo cargado: ${file.name}`
				});
				this.isUploading.set(false);
				this.uploadStatus.set(`✓ ${file.name} cargado correctamente`);
				this.fileUpload.emit();
			})
			.catch((err) => {
				console.error('Error al leer el archivo:', err);
				this.isUploading.set(false);
				this.uploadStatus.set('❌ Error al leer el archivo');
			});
	}
}
