import {
    ApplicationConfig,
    inject,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
    FirebaseApp,
    initializeApp,
    provideFirebaseApp,
} from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bearerTokenInterceptor } from './bearer-token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideAnimationsAsync(),
        provideFirebaseApp(() =>
            initializeApp({
                projectId: 'hop-on-trip',
                appId: '1:1021695945294:web:04ed9a7d2b94c91042f11f',
                storageBucket: 'hop-on-trip.firebasestorage.app',
                apiKey: 'AIzaSyBOO-paUFQej_Ae4Szsk8cJ1ji2okkTpY8',
                authDomain: 'hop-on-trip.firebaseapp.com',
                messagingSenderId: '1021695945294',
                measurementId: 'G-VZ85KL5GJ3',
            })
        ),
        provideAuth(() => getAuth(inject(FirebaseApp))),
        provideHttpClient(withInterceptors([bearerTokenInterceptor])),
    ],
};
