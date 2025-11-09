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
        children: [
            {
                path: 'businesses',
                loadChildren: () => import('./businesses/businesses.routes'),
            },
            {
                path: 'branches',
                loadChildren: () => import('./branches/branches.routes'),
            },
        ],
        canMatch: [
            authenticatedGuard
        ]
    },
];
