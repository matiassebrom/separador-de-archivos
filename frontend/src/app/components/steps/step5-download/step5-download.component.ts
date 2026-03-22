import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FileStateService } from '../../../services/file-state.service';
import { LocalExcelService } from '../../../services/local-excel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-step5-download',
	templateUrl: './step5-download.component.html',
	styleUrls: ['./step5-download.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatExpansionModule,
		MatProgressSpinnerModule
	]
})
export class Step5DownloadComponent {
	@Input() isStepCurrent: boolean = false;
	@Input() canAccessStep: boolean = false;
	@Input() isStepCompleted: boolean = false;
	@Output() nextStep = new EventEmitter<void>();

	isGenerating = signal(false);
	errorMessage = signal<string>('');

	constructor(
		public fileState: FileStateService,
		private localExcel: LocalExcelService
	) {}

	get baseName() {
		return this.fileState.baseName();
	}

	set baseName(val: string) {
		this.fileState.setBaseName(val);
	}

	async onDownload() {
		const baseName = this.baseName;
		const rows = this.fileState.rows();
		const separateBy = this.fileState.separateBy();
		const filter = this.fileState.filter();
		const keepCols = this.fileState.keepCols();

		if (!baseName || !separateBy || rows.length === 0) {
			this.errorMessage.set('Faltan datos para generar los archivos');
			return;
		}

		this.isGenerating.set(true);
		this.errorMessage.set('');

		try {
			await this.localExcel.generateAndDownloadZip(rows, separateBy, filter, keepCols, baseName);
		} catch (err) {
			console.error('Error al generar el ZIP:', err);
			this.errorMessage.set('Error al generar los archivos');
		} finally {
			this.isGenerating.set(false);
		}
	}
}
