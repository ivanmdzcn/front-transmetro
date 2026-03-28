import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const OPERADORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-operadores/lista-operadores.component').then(m => m.ListaOperadoresComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['operadores.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-operador/form-operador.component').then(m => m.FormOperadorComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['operadores.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-operador/form-operador.component').then(m => m.FormOperadorComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['operadores.editar'] }
  }
];
