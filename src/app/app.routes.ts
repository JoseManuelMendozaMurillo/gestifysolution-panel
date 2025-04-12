import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { authenticatedGuard } from './auth/guards/authenticated.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [
            notAuthenticatedGuard
        ]
    },

    {
        path: '',
        loadComponent: () => AppComponent,
        canMatch: [
            authenticatedGuard
        ]
    }
];
