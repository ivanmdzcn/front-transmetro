import { Injectable }  from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearUsuarioRequest,
  CrearUsuarioResponse,
  ObtenerUsuarioResponse,
  ObtenerTodosUsuariosResponse,
  ActualizarUsuarioRequest,
  ActualizarUsuarioResponse
} from '../models/usuario.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/Usuarios`;

  constructor(private http: HttpClient) {}

  crear(request: CrearUsuarioRequest): Observable<CrearUsuarioResponse> {
    return this.http.post<CrearUsuarioResponse>(this.apiUrl, request);
  }

  obtenerPorId(id: number): Observable<ObtenerUsuarioResponse> {
    return this.http.get<ObtenerUsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerTodos(): Observable<ObtenerTodosUsuariosResponse[]> {
    return this.http.get<ObtenerTodosUsuariosResponse[]>(this.apiUrl);
  }

  actualizar(id: number, request: ActualizarUsuarioRequest): Observable<ActualizarUsuarioResponse> {
    return this.http.put<ActualizarUsuarioResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }
}
