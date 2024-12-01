import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  { path: 'trips', component: TripsComponent },
  { path:"**", redirectTo: ''}
];
