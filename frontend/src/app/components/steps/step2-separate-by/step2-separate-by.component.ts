import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileStateService } from '../../../services/file-state.service';
import { LocalExcelService } from '../../../services/local-excel.service';

@Component({
	selector: 'app-step2-separate-by',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './step2-separate-by.component.html',
	styleUrl: './step2-separate-by.component.scss'
})
export class Step2SeparateByComponent implements OnChanges {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;

	@Output() nextStep = new EventEmitter<void>();
	selectedSeparateBy = '';

	isSaving = signal(false);
	errorMessage = signal<string>('');

	headerSearchTerm: string = '';

	get filteredHeaders(): string[] {
		const headers = this.fileStateService.headers();
		if (!this.headerSearchTerm) return headers;
		return (headers || []).filter((h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase()));
	}

	constructor(
		public fileStateService: FileStateService,
		private localExcel: LocalExcelService
	) {}

	ngOnChanges(changes: SimpleChanges) {}

	onSeparateByChange(value: string) {
		this.selectedSeparateBy = value;
	}

	onContinueClick() {
		if (!this.selectedSeparateBy) {
			this.errorMessage.set('Selecciona una columna para separar');
			return;
		}
		this.fileStateService.setSeparateBy(this.selectedSeparateBy);
		this.nextStep.emit();
	}
}
