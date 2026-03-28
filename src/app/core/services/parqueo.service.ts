import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearParqueoRequest,
  ObtenerParqueoResponse,
  ActualizarParqueoRequest
} from '../models/parqueo.models';

@Injectable({ providedIn: 'root' })
export class ParqueoService {
  private readonly apiUrl = `${environment.apiUrl}/parqueos`;

  constructor(private http: HttpClient) {}

  crear(request: CrearParqueoRequest): Observable<{ idParqueo: number }> {
    return this.http.post<{ idParqueo: number }>(this.apiUrl, request);
  }

  obtenerTodos(idEstacion?: number): Observable<ObtenerParqueoResponse[]> {
    const params: any = {};
    if (idEstacion) params['idEstacion'] = idEstacion;
    return this.http.get<ObtenerParqueoResponse[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ObtenerParqueoResponse> {
    return this.http.get<ObtenerParqueoResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarParqueoRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, { activo });
  }
}
