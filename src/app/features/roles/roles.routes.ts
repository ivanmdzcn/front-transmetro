import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const rolesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-roles/lista-roles.component').then(m => m.ListaRolesComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['roles.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-rol/form-rol.component').then(m => m.FormRolComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['roles.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-rol/form-rol.component').then(m => m.FormRolComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['roles.editar'] }
  },
  {
    path: ':id/permisos',
    loadComponent: () => import('./permisos-rol/permisos-rol.component').then(m => m.PermisosRolComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['permisos.ver'] }
  }
];
