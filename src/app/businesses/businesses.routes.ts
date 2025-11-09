import { Routes } from "@angular/router";
import { CreateBusinessComponent } from "./pages/create-business/create-business.component";

export const businessesRoutes: Routes = [
    {
        path: 'create-business',
        component: CreateBusinessComponent,
        title: 'Create Business'
    },
    {
        path: '**',
        redirectTo: 'create-business'
    }
];

export default businessesRoutes;

