import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const ALERTAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-alertas/lista-alertas.component').then(m => m.ListaAlertasComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['alertas.ver'] }
  }
];
