import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearGuardiaRequest,
  ObtenerGuardiaResponse,
  ActualizarGuardiaRequest,
  GuardiaAccesoResponse,
  AsignarAccesoGuardiaRequest
} from '../models/guardia.models';

@Injectable({ providedIn: 'root' })
export class GuardiaService {
  private readonly apiUrl = `${environment.apiUrl}/guardias`;

  constructor(private http: HttpClient) {}

  crear(request: CrearGuardiaRequest): Observable<ObtenerGuardiaResponse> {
    return this.http.post<ObtenerGuardiaResponse>(this.apiUrl, request);
  }

  obtenerTodos(): Observable<ObtenerGuardiaResponse[]> {
    return this.http.get<ObtenerGuardiaResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ObtenerGuardiaResponse> {
    return this.http.get<ObtenerGuardiaResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarGuardiaRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }

  obtenerAccesos(id: number): Observable<GuardiaAccesoResponse[]> {
    return this.http.get<GuardiaAccesoResponse[]>(`${this.apiUrl}/${id}/accesos`);
  }

  asignarAcceso(id: number, request: AsignarAccesoGuardiaRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/${id}/accesos`, request);
  }

  quitarAcceso(idGuardia: number, idAcceso: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${idGuardia}/accesos/${idAcceso}`);
  }
}
