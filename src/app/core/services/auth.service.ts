import { Injectable }                       from '@angular/core';
import { HttpClient }                       from '@angular/common/http';
import { Router }                           from '@angular/router';
import { BehaviorSubject, Observable }      from 'rxjs';
import { tap }                              from 'rxjs/operators';
import {
  LoginRequest, LoginResponse,
  MiPerfilResponse, UserSession
} from '../models/auth.models';
import { environment }                      from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  public  currentUser$       = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  // ── Login ─────────────────────────────────────────────────────────
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/Auth/login`,
      credentials
    ).pipe(
      tap(res => {
        localStorage.setItem('token',      res.token);
        localStorage.setItem('nombre',     res.nombre);
        localStorage.setItem('email',      res.email);
        localStorage.setItem('rol',        res.nombreRol ?? '');
        localStorage.setItem('expiracion', String(res.expiracion));
        this.cargarPermisos();
      })
    );
  }

  // ── Perfil del usuario autenticado ────────────────────────────────
  getMiPerfil(): Observable<MiPerfilResponse> {
    return this.http.get<MiPerfilResponse>(
      `${environment.apiUrl}/Auth/me`
    ).pipe(
      tap(perfil => {
        const session: UserSession = {
          token:      this.getToken()!,
          nombre:     perfil.nombre,
          email:      perfil.email,
          rol:        perfil.rol,
          expiracion: new Date(localStorage.getItem('expiracion')!),
          permisos:   perfil.permisos
        };
        localStorage.setItem('permisos', JSON.stringify(perfil.permisos));
        this.currentUserSubject.next(session);
      })
    );
  }

  // ── Logout ────────────────────────────────────────────────────────
  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ── Helpers de autenticación ──────────────────────────────────────
  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem('expiracion');
    if (!exp) return true;
    return new Date(exp) <= new Date();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ── Helpers de datos de usuario ───────────────────────────────────
  getNombreUsuario(): string       { return localStorage.getItem('nombre') ?? ''; }
  getRol():          string | null { return localStorage.getItem('rol') || null; }

  // ── Helpers de permisos ───────────────────────────────────────────
  getPermisos(): string[] {
    const raw = localStorage.getItem('permisos');
    return raw ? (JSON.parse(raw) as string[]) : [];
  }

  tienePermiso(permiso: string):          boolean { return this.getPermisos().includes(permiso); }
  tieneAlgunPermiso(permisos: string[]):  boolean { return permisos.some(p  => this.getPermisos().includes(p)); }
  tieneTodosPermisos(permisos: string[]): boolean { return permisos.every(p => this.getPermisos().includes(p)); }

  // ── Privados ──────────────────────────────────────────────────────
  private cargarPermisos(): void {
    this.getMiPerfil().subscribe({ error: err => console.error('Error cargando permisos:', err) });
  }

  private restoreSession(): void {
    const token = this.getToken();
    if (!token) return; // Sin sesión previa
    if (this.isTokenExpired()) {
      this.clearStorage(); // Token expirado — el guard redirigirá
      return;
    }
    const session: UserSession = {
      token,
      nombre:     localStorage.getItem('nombre')     ?? '',
      email:      localStorage.getItem('email')      ?? '',
      rol:        localStorage.getItem('rol')        || null,
      expiracion: new Date(localStorage.getItem('expiracion')!),
      permisos:   this.getPermisos()
    };
    this.currentUserSubject.next(session);
  }

  private clearStorage(): void {
    ['token', 'nombre', 'email', 'rol', 'expiracion', 'permisos']
      .forEach(k => localStorage.removeItem(k));
  }

  // ── Cambio de contraseña ──────────────────────────────────────────
  cambiarContrasena(contrasenaActual: string, contrasenaNueva: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/Auth/cambiar-contrasena`,
      { contrasenaActual, contrasenaNueva }
    );
  }
}
