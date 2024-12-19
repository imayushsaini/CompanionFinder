import { Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'app-trip-details-page',
    imports: [MatRippleModule, NavBarComponent, FooterComponent, MatIconModule],
    templateUrl: './trip-details-page.component.html',
    styleUrl: './trip-details-page.component.scss',
})
export class TripDetailsPageComponent {
    constructor(private router: Router) {}
    onBackButtonPress() {
        this.router.navigate(['/trips']);
    }
}
