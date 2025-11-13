import { Routes } from "@angular/router";
import { CreateBusinessComponent } from "./pages/create-business/create-business.component";

export const businessesRoutes: Routes = [
    {
        path: 'list-businesses',
        component: CreateBusinessComponent,
        title: 'List of Businesses'
    },
    {
        path: '**',
        redirectTo: 'list-businesses'
    }
];

export default businessesRoutes;

