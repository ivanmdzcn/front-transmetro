import { Injectable }  from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { forkJoin }     from 'rxjs';
import { environment } from '../../../environments/environment';
import { ObtenerPermisosPorRolResponse } from '../models/rol-permiso.models';

@Injectable({ providedIn: 'root' })
export class RolPermisoService {
  private readonly base = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  obtenerPermisos(rolId: number): Observable<ObtenerPermisosPorRolResponse[]> {
    return this.http.get<ObtenerPermisosPorRolResponse[]>(`${this.base}/${rolId}/permisos`);
  }

  asignarPermiso(rolId: number, permisoId: number): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.base}/${rolId}/permisos/${permisoId}`, {});
  }

  quitarPermiso(rolId: number, permisoId: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.base}/${rolId}/permisos/${permisoId}`);
  }

  asignarVariosPermisos(rolId: number, permisosIds: number[]): Observable<{ mensaje: string }[]> {
    return forkJoin(permisosIds.map(id => this.asignarPermiso(rolId, id)));
  }

  quitarVariosPermisos(rolId: number, permisosIds: number[]): Observable<{ mensaje: string }[]> {
    return forkJoin(permisosIds.map(id => this.quitarPermiso(rolId, id)));
  }
}
