import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const PILOTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-pilotos/lista-pilotos.component').then(m => m.ListaPilotosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['pilotos.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-piloto/form-piloto.component').then(m => m.FormPilotoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['pilotos.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-piloto/form-piloto.component').then(m => m.FormPilotoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['pilotos.editar'] }
  },
  {
    path: ':id/detalle',
    loadComponent: () => import('./detalle-piloto/detalle-piloto.component').then(m => m.DetallePilotoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['pilotos.ver'] }
  }
];
