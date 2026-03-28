import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth',    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },
  { path: 'errores', loadChildren: () => import('./features/errors/errors.routes').then(m => m.errorsRoutes) },
  {
    path: '',
    loadChildren: () => import('./features/layout/layout.routes').then(m => m.layoutRoutes),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'errores/not-found' }
];
