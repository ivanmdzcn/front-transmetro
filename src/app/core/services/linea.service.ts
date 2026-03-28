import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearLineaRequest,
  ObtenerLineaResponse,
  ActualizarLineaRequest,
  AsignarEstacionRequest,
  ActualizarLineaEstacionRequest,
  LineaEstacionResponse,
  DistanciaLineaResponse,
  AccesoPorLineaResponse
} from '../models/linea.models';

@Injectable({ providedIn: 'root' })
export class LineaService {
  private readonly apiUrl = `${environment.apiUrl}/lineas`;

  constructor(private http: HttpClient) {}

  crear(request: CrearLineaRequest): Observable<{ idLinea: number }> {
    return this.http.post<{ idLinea: number }>(this.apiUrl, request);
  }

  obtenerTodos(idMunicipalidad?: number): Observable<ObtenerLineaResponse[]> {
    const params: any = {};
    if (idMunicipalidad) params['idMunicipalidad'] = idMunicipalidad;
    return this.http.get<ObtenerLineaResponse[]>(this.apiUrl, { params });
  }

  obtenerActivas(): Observable<ObtenerLineaResponse[]> {
    return this.http.get<ObtenerLineaResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ObtenerLineaResponse> {
    return this.http.get<ObtenerLineaResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarLineaRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, { activo });
  }

  // LineaEstaciones sub-resource
  obtenerEstaciones(idLinea: number): Observable<LineaEstacionResponse[]> {
    return this.http.get<LineaEstacionResponse[]>(`${this.apiUrl}/${idLinea}/estaciones`);
  }

  asignarEstacion(idLinea: number, request: AsignarEstacionRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/${idLinea}/estaciones`, request);
  }

  actualizarEstacion(idLinea: number, idLineaEstacion: number, request: ActualizarLineaEstacionRequest): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${idLinea}/estaciones/${idLineaEstacion}`, request);
  }

  actualizarDistancia(idLinea: number, idLineaEstacion: number, distancia: number | null): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${idLinea}/estaciones/${idLineaEstacion}/distancia`, distancia);
  }

  quitarEstacion(idLinea: number, idLineaEstacion: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${idLinea}/estaciones/${idLineaEstacion}`);
  }

  obtenerDistancia(idLinea: number): Observable<DistanciaLineaResponse> {
    return this.http.get<DistanciaLineaResponse>(`${this.apiUrl}/${idLinea}/estaciones/distancia`);
  }

  obtenerAccesosPorLinea(idLinea: number): Observable<AccesoPorLineaResponse[]> {
    return this.http.get<AccesoPorLineaResponse[]>(`${this.apiUrl}/${idLinea}/accesos`);
  }
}
