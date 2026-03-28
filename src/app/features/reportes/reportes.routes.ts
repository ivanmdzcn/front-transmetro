import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['reportes.ver'] }
  }
];
