import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TripsComponent } from './trips/trips.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TripDetailsPageComponent } from './trip-details-page/trip-details-page.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'trips', component: TripsComponent },
    { path: 'trip/:tripId', component: TripDetailsPageComponent },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['/']) },
    },
    { path: '**', redirectTo: '' },
];
