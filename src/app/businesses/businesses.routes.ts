import { Routes } from "@angular/router";
import { ListBusinessesComponent } from "./pages/list-businesses/list-businesses.component";

export const businessesRoutes: Routes = [
    {
        path: 'list-businesses',
        component: ListBusinessesComponent,
        title: 'List of Businesses'
    },
    {
        path: '**',
        redirectTo: 'list-businesses'
    }
];

export default businessesRoutes;

