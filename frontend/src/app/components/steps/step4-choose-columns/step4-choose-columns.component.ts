import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { FileStateService } from '../../../services/file-state.service';

@Component({
	selector: 'app-step4-choose-columns',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		MatChipsModule
	],
	templateUrl: './step4-choose-columns.component.html',
	styleUrl: './step4-choose-columns.component.scss'
})
export class Step4ChooseColumnsComponent {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;
	@Output() nextStep = new EventEmitter<void>();

	selectedColumn: string = '';
	selectedColumns: string[] = [];
	headerSearchTerm: string = '';

	constructor(public fileStateService: FileStateService) {}

	get filteredHeaders(): string[] {
		const headers = this.fileStateService.headers();
		if (!this.headerSearchTerm) return headers;
		return (headers || []).filter((h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase()));
	}

	onColumnChange(header: string) {
		this.selectedColumn = header;
		if (header && !this.selectedColumns.includes(header)) {
			this.selectedColumns = [...this.selectedColumns, header];
		}
	}

	removeColumn(header: string) {
		this.selectedColumns = this.selectedColumns.filter((col) => col !== header);
		if (this.selectedColumn === header) {
			this.selectedColumn = '';
		}
	}

	onContinue() {
		if (this.selectedColumns.length === 0) return;
		this.fileStateService.setKeepCols(this.selectedColumns);
		this.nextStep.emit();
	}
}
