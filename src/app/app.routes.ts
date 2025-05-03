import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { authenticatedGuard } from './auth/guards/authenticated.guard';
import { LayoutComponent } from './layout/layout/layout.component';
import { NavbarComponent } from './layout/components/navbar/navbar.component';

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
        loadComponent: () => LayoutComponent,
        canMatch: [
            authenticatedGuard
        ]
    },

    {
        path: 'bosses',
        loadComponent: () => NavbarComponent,
    },

    {
        path: 'businesses',
        loadComponent: () => NavbarComponent,
    },

    {
        path: 'branches1',
        loadComponent: () => NavbarComponent,
    },

    {
        path: 'branches2',
        loadComponent: () => NavbarComponent,
    },
];
