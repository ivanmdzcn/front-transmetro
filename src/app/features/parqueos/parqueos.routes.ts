import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const parqueosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-parqueos/lista-parqueos.component').then(m => m.ListaParqueosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['parqueos.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-parqueo/form-parqueo.component').then(m => m.FormParqueoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['parqueos.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-parqueo/form-parqueo.component').then(m => m.FormParqueoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['parqueos.editar'] }
  }
];
