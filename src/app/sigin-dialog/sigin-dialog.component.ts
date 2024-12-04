import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-sigin-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './sigin-dialog.component.html',
  styleUrl: './sigin-dialog.component.scss'
})
export class SiginDialogComponent {

}
