import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const usuariosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-usuarios/lista-usuarios.component').then(m => m.ListaUsuariosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['usuarios.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-usuario/form-usuario.component').then(m => m.FormUsuarioComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['usuarios.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-usuario/form-usuario.component').then(m => m.FormUsuarioComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['usuarios.editar'] }
  },
  {
    path: ':id/permisos',
    loadComponent: () => import('./permisos-usuario/permisos-usuario.component').then(m => m.PermisosUsuarioComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['permisos.ver'] }
  }
];
