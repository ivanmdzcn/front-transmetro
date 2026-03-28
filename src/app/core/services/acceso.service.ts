import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearAccesoRequest,
  ObtenerAccesoResponse,
  ActualizarAccesoRequest,
  ObtenerGuardiasAccesoResponse
} from '../models/acceso.models';

@Injectable({ providedIn: 'root' })
export class AccesoService {
  private readonly apiUrl = `${environment.apiUrl}/accesos`;

  constructor(private http: HttpClient) {}

  crear(request: CrearAccesoRequest): Observable<{ idAcceso: number }> {
    return this.http.post<{ idAcceso: number }>(this.apiUrl, request);
  }

  obtenerTodos(idEstacion?: number): Observable<ObtenerAccesoResponse[]> {
    const params: any = {};
    if (idEstacion) params['idEstacion'] = idEstacion;
    return this.http.get<ObtenerAccesoResponse[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<ObtenerAccesoResponse> {
    return this.http.get<ObtenerAccesoResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarAccesoRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }

  obtenerGuardias(id: number): Observable<ObtenerGuardiasAccesoResponse[]> {
    return this.http.get<ObtenerGuardiasAccesoResponse[]>(`${this.apiUrl}/${id}/guardias`);
  }

  asignarGuardia(id: number, idGuardia: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/guardias/${idGuardia}`, {});
  }

  quitarGuardia(id: number, idGuardia: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/guardias/${idGuardia}`);
  }
}
