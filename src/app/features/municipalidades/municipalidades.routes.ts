import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const municipalidadesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-municipalidades/lista-municipalidades.component').then(m => m.ListaMunicipalidadesComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['municipalidades.ver'] }
  },
  {
    path: 'crear',
    loadComponent: () => import('./form-municipalidad/form-municipalidad.component').then(m => m.FormMunicipalidadComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['municipalidades.crear'] }
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./form-municipalidad/form-municipalidad.component').then(m => m.FormMunicipalidadComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['municipalidades.editar'] }
  }
];
