import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';

// Importar los componentes de pasos
import { Step1UploadComponent } from './components/steps/step1-upload/step1-upload.component';
import { Step2SeparateByComponent } from './components/steps/step2-separate-by/step2-separate-by.component';
import { Step3FiltersComponent } from './components/steps/step3-filters/step3-filters.component';
import { Step4ChooseColumnsComponent } from './components/steps/step4-choose-columns/step4-choose-columns.component';
import { Step5DownloadComponent } from './components/steps/step5-download/step5-download.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		// Step components
		Step1UploadComponent,
		Step2SeparateByComponent,
		Step3FiltersComponent,
		Step4ChooseColumnsComponent,
		Step5DownloadComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	constructor(private api: ApiService) {}
	
	// Remove unused property
	// selectedColumnsMap: Record<string, boolean> = {};

	title = 'split-excel-frontend';
	currentStep = 1;
	fileUploaded = false;

	ngOnInit(): void {
		// Llamar al backend al iniciar la app
		this.api.pingBackend().subscribe({
			next: () => {
				// Backend is connected
				// In production, consider using a proper logger instead of console
			},
			error: () => {
				// Handle backend connection error
				// In production, show user-friendly error message
			}
		});
	}

	nextStep(): void {
		if (this.currentStep < 5) {
			this.currentStep++;
		}
	}
	
	isStepCompleted(step: number): boolean {
		return this.currentStep > step;
	}
	
	isStepCurrent(step: number): boolean {
		return this.currentStep === step;
	}
	
	canAccessStep(step: number): boolean {
		return step <= this.currentStep;
	}
	
	onFileUpload(): void {
		this.fileUploaded = true;
		this.nextStep();
	}
}
