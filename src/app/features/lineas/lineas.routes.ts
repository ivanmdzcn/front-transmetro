import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const lineasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-lineas/lista-lineas.component').then(m => m.ListaLineasComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['lineas.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-linea/form-linea.component').then(m => m.FormLineaComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['lineas.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-linea/form-linea.component').then(m => m.FormLineaComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['lineas.editar'] }
  },
  {
    path: ':id/estaciones',
    loadComponent: () => import('./estaciones-linea/estaciones-linea.component').then(m => m.EstacionesLineaComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['lineas.ver'] }
  }
];
