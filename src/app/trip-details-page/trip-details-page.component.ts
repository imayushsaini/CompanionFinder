import { Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-trip-details-page',
  imports: [MatRippleModule, NavBarComponent, FooterComponent],
  templateUrl: './trip-details-page.component.html',
  styleUrl: './trip-details-page.component.scss'
})
export class TripDetailsPageComponent {

}
