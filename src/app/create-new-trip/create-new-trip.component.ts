import { CommonModule } from '@angular/common';
import { Component, inject, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../service/api.service';
interface Trip {
    title: string;
    startDate: Date;
    endDate: Date;
    from_location: string;
    to_location: string;
    itinerary: string[];
    contactDetails: string;
    additional_info: string;
    bannerUrl?: string[];
}

@Component({
    selector: 'app-create-new-trip',
    imports: [
        CommonModule,
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './create-new-trip.component.html',
    styleUrl: './create-new-trip.component.scss',
})
export class CreateNewTripComponent {
    private _formBuilder = inject(FormBuilder);
    DAYS_COUNT = 0;
    @Output() close = new EventEmitter<void>();
    dayPlans: FormGroup[] = [];
    constructor(private apiService: ApiService) {
        this.journeyOverviewFormGroup.controls.startDate.valueChanges.subscribe(
            (value) => {
                if (value) {
                    this.onDateChange();
                }
            }
        );
        this.journeyOverviewFormGroup.controls.endDate.valueChanges.subscribe(
            (value) => {
                if (value) {
                    this.onDateChange();
                }
            }
        );
    }
    journeyOverviewFormGroup = this._formBuilder.group({
        title: ['', Validators.required],
        startPoint: ['', Validators.required],
        destination: ['', Validators.required],
        startDate: new FormControl<Date | null>(null, Validators.required),
        endDate: new FormControl<Date | null>(null, Validators.required),
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
    additionaInfoFormGroup = this._formBuilder.group({
        additionalInfo: ['', Validators.required],
        contactDetails: ['', Validators.required],
    });

    get itineraryStepperControl(): FormGroup | FormControl {
        // Combine validation state of all nested forms (itinerary forms)
        // if invalid , return a dummy form contrl with required validator so it will show error.
        const isValid = this.dayPlans.every((form) => form.valid);
        return isValid
            ? this.dayPlans[0]
            : new FormControl(null, Validators.required);
    }
    onDateChange() {
        const startDate =
            this.journeyOverviewFormGroup.controls.startDate.value;
        const endDate = this.journeyOverviewFormGroup.controls.endDate.value;
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            this.DAYS_COUNT = diffDays + 1;
        }
        this.generateItineraryForm();
    }
    generateItineraryForm() {
        if (this.dayPlans.length > this.DAYS_COUNT) {
            this.dayPlans.splice(this.DAYS_COUNT);
        } else if (this.dayPlans.length < this.DAYS_COUNT) {
            for (let i = 0; i < this.DAYS_COUNT; i++) {
                this.dayPlans.push(
                    this._formBuilder.group({
                        plan: ['', Validators.required],
                    })
                );
            }
        }
    }
    submit() {
        const payload: Trip = {
            title: this.journeyOverviewFormGroup.controls.title.value!,
            from_location:
                this.journeyOverviewFormGroup.controls.startPoint.value!,
            to_location:
                this.journeyOverviewFormGroup.controls.destination.value!,
            startDate: this.journeyOverviewFormGroup.controls.startDate.value!,
            endDate: this.journeyOverviewFormGroup.controls.endDate.value!,
            itinerary: this.dayPlans.map((form) => form.controls['plan'].value), // This is the array of day plans
            additional_info:
                this.additionaInfoFormGroup.controls.additionalInfo.value!,
            contactDetails:
                this.additionaInfoFormGroup.controls.contactDetails.value!,
        };
        this.apiService.createTrip(payload).subscribe({
            next: (res) => {
                console.log(res);
                this.onClose();
            },
            error: (err) => {
                console.error(err);
            },
        });
    }
    onClose() {
        this.close.emit();
    }
}
