import { Routes } from '@angular/router';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
  }
];