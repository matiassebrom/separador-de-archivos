import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FileStateService } from '../../../services/file-state.service';
import { LocalExcelService } from '../../../services/local-excel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-step3-filters',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
		MatChipsModule
	],
	templateUrl: './step3-filters.component.html',
	styleUrl: './step3-filters.component.scss'
})
export class Step3FiltersComponent implements OnInit, OnChanges {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;

	@Output() nextStep = new EventEmitter<void>();

	columnValues: string[] = [];
	selectedFilterColumn: string = '';
	selectedColumnValues: string[] = [];
	headerSearchTerm: string = '';
	searchTerm = '';

	get filteredColumnValues(): string[] {
		if (!this.searchTerm) return this.columnValues;
		return this.columnValues.filter((v) => v && v.toLowerCase().includes(this.searchTerm.toLowerCase()));
	}

	get filteredHeaders(): string[] {
		const headers = this.fileStateService.headers();
		if (!this.headerSearchTerm) return headers;
		return (headers || []).filter((h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase()));
	}

	constructor(
		public fileStateService: FileStateService,
		private localExcel: LocalExcelService
	) {}

	ngOnInit() {}

	ngOnChanges(changes: SimpleChanges) {}

	onFilterColumnChange(header: string) {
		this.selectedFilterColumn = header;
		const rows = this.fileStateService.rows();
		this.columnValues = this.localExcel.getUniqueValues(rows, header);
	}

	onContinue() {
		if (this.selectedFilterColumn && this.selectedColumnValues.length > 0) {
			this.fileStateService.setFilter({
				header: this.selectedFilterColumn,
				values: this.selectedColumnValues
			});
		} else {
			this.fileStateService.setFilter(null);
		}
		this.nextStep.emit();
	}

	isColumnValueSelected(value: string): boolean {
		return this.selectedColumnValues.includes(value);
	}

	toggleColumnValue(value: string) {
		if (this.isColumnValueSelected(value)) {
			this.selectedColumnValues = this.selectedColumnValues.filter((v) => v !== value);
		} else {
			this.selectedColumnValues = [...this.selectedColumnValues, value];
		}
	}

	clearFilters() {
		this.selectedFilterColumn = '';
		this.selectedColumnValues = [];
		this.headerSearchTerm = '';
		this.searchTerm = '';
		this.columnValues = [];
		this.fileStateService.setFilter(null);
	}
}
