import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearEstacionRequest,
  ObtenerEstacionResponse,
  ActualizarEstacionRequest,
  MonitoreoEstacionResponse
} from '../models/estacion.models';

@Injectable({ providedIn: 'root' })
export class EstacionService {
  private readonly apiUrl = `${environment.apiUrl}/estaciones`;

  constructor(private http: HttpClient) {}

  crear(request: CrearEstacionRequest): Observable<{ idEstacion: number }> {
    return this.http.post<{ idEstacion: number }>(this.apiUrl, request);
  }

  obtenerTodos(idMunicipalidad?: number): Observable<ObtenerEstacionResponse[]> {
    const params: any = {};
    if (idMunicipalidad) params['idMunicipalidad'] = idMunicipalidad;
    return this.http.get<ObtenerEstacionResponse[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ObtenerEstacionResponse> {
    return this.http.get<ObtenerEstacionResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarEstacionRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, { activo });
  }

  obtenerMonitoreo(): Observable<MonitoreoEstacionResponse[]> {
    return this.http.get<MonitoreoEstacionResponse[]>(`${this.apiUrl}/monitoreo`);
  }

  actualizarPasajeros(id: number, delta: number): Observable<{ pasajerosActuales: number }> {
    return this.http.patch<{ pasajerosActuales: number }>(`${this.apiUrl}/${id}/pasajeros`, { delta });
  }
}
