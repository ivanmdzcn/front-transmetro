import { Routes } from '@angular/router';

export const errorsRoutes: Routes = [
  {
    path: 'acceso-denegado',
    loadComponent: () => import('./acceso-denegado/acceso-denegado.component').then(m => m.AccesoDenegadoComponent)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  { path: '', redirectTo: 'not-found', pathMatch: 'full' }
];
