import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { SignInComponent } from "./pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";

export const authRoutes: Routes = [
    {
        path: '', 
        component: AuthLayoutComponent,
        children: [
            {
                path: 'sign-in',
                component: SignInComponent,
                title: 'Sign in'
            },
            {
                path: 'sign-up',
                component: SignUpComponent,
                title: 'Sign up'
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ] 
    }
];

export default authRoutes;

