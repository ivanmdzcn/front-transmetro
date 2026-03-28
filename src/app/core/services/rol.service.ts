import { Injectable }  from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { map }          from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CrearRolRequest,
  CrearRolResponse,
  ObtenerRolResponse,
  ObtenerTodosRolesResponse,
  ActualizarRolRequest,
  ActualizarRolResponse
} from '../models/rol.models';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly apiUrl = `${environment.apiUrl}/Roles`;

  constructor(private http: HttpClient) {}

  crear(request: CrearRolRequest): Observable<CrearRolResponse> {
    return this.http.post<CrearRolResponse>(this.apiUrl, request);
  }

  obtenerPorId(id: number): Observable<ObtenerRolResponse> {
    return this.http.get<ObtenerRolResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerTodos(): Observable<ObtenerTodosRolesResponse[]> {
    return this.http.get<ObtenerTodosRolesResponse[]>(this.apiUrl);
  }

  /** Filtra solo roles activos — útil para selectores de formulario */
  obtenerActivos(): Observable<ObtenerTodosRolesResponse[]> {
    return this.obtenerTodos().pipe(map(roles => roles.filter(r => r.activo)));
  }

  actualizar(id: number, request: ActualizarRolRequest): Observable<ActualizarRolResponse> {
    return this.http.put<ActualizarRolResponse>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }
}
