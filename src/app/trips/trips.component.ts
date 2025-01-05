import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { NewTripPublishDialogComponent } from '../new-trip-publish-dialog/new-trip-publish-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CreateNewTripComponent } from '../create-new-trip/create-new-trip.component';

@Component({
    selector: 'app-trips',
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        FooterComponent,
        NavBarComponent,
        MatDialogModule,
        CreateNewTripComponent,
    ],
    templateUrl: './trips.component.html',
    styleUrl: './trips.component.scss',
})
export class TripsComponent {
    readonly dialog = inject(MatDialog);
    readonly apiService = inject(ApiService);
    readonly auth = inject(Auth);
    showCreateTripForm = false;
    constructor() {
        onAuthStateChanged(this.auth, () => {
            this.callApi();
        });
    }
    onNewTrip() {
        this.showCreateTripForm = true;
    }
    onClose() {
        this.showCreateTripForm = false;
    }
    callApi() {
        this.apiService.getUserPosts().subscribe((res) => {
            console.log(res);
        });
    }
}
