import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const permisosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-permisos/lista-permisos.component').then(m => m.ListaPermisosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['permisos.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-permiso/form-permiso.component').then(m => m.FormPermisoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['permisos.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-permiso/form-permiso.component').then(m => m.FormPermisoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['permisos.editar'] }
  }
];
