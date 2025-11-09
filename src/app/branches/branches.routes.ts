import { Routes } from "@angular/router";
import { CreateBranchComponent } from "./pages/create-branch/create-branch.component";

export const branchesRoutes: Routes = [
    {
        path: 'create-branch',
        component: CreateBranchComponent,
        title: 'Create Branch'
    },
    {
        path: '**',
        redirectTo: 'create-branch'
    }
];

export default branchesRoutes;

