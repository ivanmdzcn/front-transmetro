import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const GUARDIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-guardias/lista-guardias.component').then(m => m.ListaGuardiasComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['guardias.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-guardia/form-guardia.component').then(m => m.FormGuardiaComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['guardias.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-guardia/form-guardia.component').then(m => m.FormGuardiaComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['guardias.editar'] }
  }
];
