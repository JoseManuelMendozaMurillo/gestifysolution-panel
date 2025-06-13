import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { authenticatedGuard } from './auth/guards/authenticated.guard';
import { LayoutComponent } from './layout/layout/layout.component';

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
        path: 'businesses',
        loadComponent: () => LayoutComponent,
    },


];
