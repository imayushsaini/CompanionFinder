import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-new-trip-publish-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, MatCheckboxModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './new-trip-publish-dialog.component.html',
  styleUrl: './new-trip-publish-dialog.component.scss'
})
export class NewTripPublishDialogComponent {
  readonly checked = model(false);
}
