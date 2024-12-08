import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { NewTripPublishDialogComponent } from '../new-trip-publish-dialog/new-trip-publish-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trips',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, FooterComponent, NavBarComponent, MatDialogModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent {
  readonly dialog = inject(MatDialog);
    openDialog() {
    const dialogRef = this.dialog.open(NewTripPublishDialogComponent, {
      height: '550px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
