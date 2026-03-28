import { Injectable }  from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ObtenerPermisosUsuarioResponse,
  PermisosResueltosResponse,
  AsignarOverrideRequest
} from '../models/usuario-permiso.models';

@Injectable({ providedIn: 'root' })
export class UsuarioPermisoService {
  private readonly base = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  obtenerPermisos(usuarioId: number): Observable<ObtenerPermisosUsuarioResponse[]> {
    return this.http.get<ObtenerPermisosUsuarioResponse[]>(`${this.base}/${usuarioId}/permisos`);
  }

  obtenerPermisosResueltos(usuarioId: number): Observable<PermisosResueltosResponse[]> {
    return this.http.get<PermisosResueltosResponse[]>(`${this.base}/${usuarioId}/permisos/resueltos`);
  }

  asignarPermiso(usuarioId: number, request: AsignarOverrideRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.base}/${usuarioId}/permisos`, request);
  }

  quitarPermiso(usuarioId: number, permisoId: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.base}/${usuarioId}/permisos/${permisoId}`);
  }

  concederPermiso(usuarioId: number, permisoId: number): Observable<{ mensaje: string }> {
    return this.asignarPermiso(usuarioId, { permisoId, concedido: true });
  }

  denegarPermiso(usuarioId: number, permisoId: number): Observable<{ mensaje: string }> {
    return this.asignarPermiso(usuarioId, { permisoId, concedido: false });
  }
}
