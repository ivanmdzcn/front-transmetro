import { inject }                               from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError }                           from 'rxjs';
import { catchError }                           from 'rxjs/operators';
import { AuthService }                          from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.getToken();

  if (token && auth.isAuthenticated()) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) auth.logout();
      return throwError(() => error);
    })
  );
};
