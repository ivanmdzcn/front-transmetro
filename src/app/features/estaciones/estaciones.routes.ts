import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const estacionesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-estaciones/lista-estaciones.component').then(m => m.ListaEstacionesComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['estaciones.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-estacion/form-estacion.component').then(m => m.FormEstacionComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['estaciones.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-estacion/form-estacion.component').then(m => m.FormEstacionComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['estaciones.editar'] }
  },
  {
    path: 'monitoreo',
    loadComponent: () => import('./monitoreo-estaciones/monitoreo-estaciones.component').then(m => m.MonitoreoEstacionesComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['estaciones.ver'] }
  }
];
