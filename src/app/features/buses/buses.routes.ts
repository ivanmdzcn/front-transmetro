import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const BUSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-buses/lista-buses.component').then(m => m.ListaBusesComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['buses.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-bus/form-bus.component').then(m => m.FormBusComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['buses.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-bus/form-bus.component').then(m => m.FormBusComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['buses.editar'] }
  },
  {
    path: ':id/historial',
    loadComponent: () => import('./historial-bus/historial-bus.component').then(m => m.HistorialBusComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['buses.ver'] }
  }
];
