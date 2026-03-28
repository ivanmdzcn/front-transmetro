import { inject }                       from '@angular/core';
import { CanActivateFn, Router,
         ActivatedRouteSnapshot }        from '@angular/router';
import { AuthService }                   from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const requeridos = (route.data['permisos'] as string[]) ?? [];

  // Sin permisos requeridos → permitir
  if (requeridos.length === 0) return true;

  if (auth.tieneAlgunPermiso(requeridos)) return true;

  // No tiene permisos → acceso denegado
  return router.createUrlTree(['/errores/acceso-denegado']);
};
