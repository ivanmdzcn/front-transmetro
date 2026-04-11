import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearOperadorRequest,
  ObtenerOperadorResponse,
  ActualizarOperadorRequest
} from '../models/operador.models';

@Injectable({ providedIn: 'root' })
export class OperadorService {
  private readonly apiUrl = `${environment.apiUrl}/operadores`;

  constructor(private http: HttpClient) {}

  crear(request: CrearOperadorRequest): Observable<ObtenerOperadorResponse> {
    return this.http.post<ObtenerOperadorResponse>(this.apiUrl, request);
  }

  obtenerTodos(): Observable<ObtenerOperadorResponse[]> {
    return this.http.get<ObtenerOperadorResponse[]>(this.apiUrl);
  }

  obtenerActivos(): Observable<ObtenerOperadorResponse[]> {
    return this.http.get<ObtenerOperadorResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ObtenerOperadorResponse> {
    return this.http.get<ObtenerOperadorResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarOperadorRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }
}
