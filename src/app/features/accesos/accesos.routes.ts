import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const accesosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-accesos/lista-accesos.component').then(m => m.ListaAccesosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['accesos.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-acceso/form-acceso.component').then(m => m.FormAccesoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['accesos.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-acceso/form-acceso.component').then(m => m.FormAccesoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['accesos.editar'] }
  },
  {
    path: ':id/guardias',
    loadComponent: () => import('./guardias-acceso/guardias-acceso.component').then(m => m.GuardiasAccesoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['guardias.ver'] }
  }
];
