import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearBusRequest,
  ObtenerBusResponse,
  ActualizarBusRequest,
  AsignarLineaBusRequest,
  CambiarParqueoRequest,
  BusParqueoHistorialResponse
} from '../models/bus.models';

@Injectable({ providedIn: 'root' })
export class BusService {
  private readonly apiUrl = `${environment.apiUrl}/buses`;

  constructor(private http: HttpClient) {}

  crear(request: CrearBusRequest): Observable<ObtenerBusResponse> {
    return this.http.post<ObtenerBusResponse>(this.apiUrl, request);
  }

  obtenerTodos(idLinea?: number, idParqueo?: number): Observable<ObtenerBusResponse[]> {
    const params: any = {};
    if (idLinea)   params['idLinea']   = idLinea;
    if (idParqueo) params['idParqueo'] = idParqueo;
    return this.http.get<ObtenerBusResponse[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ObtenerBusResponse> {
    return this.http.get<ObtenerBusResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarBusRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, estado: string): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  asignarLinea(id: number, request: AsignarLineaBusRequest): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/linea`, request);
  }

  cambiarParqueo(id: number, request: CambiarParqueoRequest): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/parqueo`, request);
  }

  obtenerHistorialParqueos(id: number): Observable<BusParqueoHistorialResponse[]> {
    return this.http.get<BusParqueoHistorialResponse[]>(`${this.apiUrl}/${id}/historial-parqueos`);
  }
}
