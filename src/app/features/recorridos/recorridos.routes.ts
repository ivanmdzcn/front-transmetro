import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const RECORRIDOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista-recorridos/lista-recorridos.component').then(m => m.ListaRecorridosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['recorridos.ver'] }
  },
  {
    path: 'iniciar',
    loadComponent: () => import('./iniciar-recorrido/iniciar-recorrido.component').then(m => m.IniciarRecorridoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['recorridos.crear'] }
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial-recorridos/historial-recorridos.component').then(m => m.HistorialRecorridosComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['recorridos.ver'] }
  },
  {
    path: 'paradas/:id',
    loadComponent: () => import('./paradas-recorrido/paradas-recorrido.component').then(m => m.ParadasRecorridoComponent),
    canActivate: [permissionGuard],
    data: { permisos: ['recorridos.ver'] }
  }
];
