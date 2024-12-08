import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TripDetailsPageComponent } from './trip-details-page/trip-details-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'trip/:tripId', component: TripDetailsPageComponent},
  { path: "**", redirectTo: ''}
];
