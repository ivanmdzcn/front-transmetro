import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const configuracionRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./form-configuracion/form-configuracion.component').then(m => m.FormConfiguracionComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['configuracion.ver'] }
  }
];
