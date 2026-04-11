import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearPilotoRequest,
  ObtenerPilotoResponse,
  ActualizarPilotoRequest,
  AsignarBusPilotoRequest,
  PilotoEducacionResponse,
  AgregarEducacionRequest,
  PilotoResidenciaResponse,
  GuardarResidenciaRequest
} from '../models/piloto.models';

@Injectable({ providedIn: 'root' })
export class PilotoService {
  private readonly apiUrl = `${environment.apiUrl}/pilotos`;

  constructor(private http: HttpClient) {}

  crear(request: CrearPilotoRequest): Observable<ObtenerPilotoResponse> {
    return this.http.post<ObtenerPilotoResponse>(this.apiUrl, request);
  }

  obtenerTodos(): Observable<ObtenerPilotoResponse[]> {
    return this.http.get<ObtenerPilotoResponse[]>(this.apiUrl);
  }

  obtenerActivos(): Observable<ObtenerPilotoResponse[]> {
    return this.http.get<ObtenerPilotoResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ObtenerPilotoResponse> {
    return this.http.get<ObtenerPilotoResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarPilotoRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }

  asignarBus(id: number, request: AsignarBusPilotoRequest): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/asignar-bus`, request);
  }

  // Educación
  obtenerEducaciones(id: number): Observable<PilotoEducacionResponse[]> {
    return this.http.get<PilotoEducacionResponse[]>(`${this.apiUrl}/${id}/educacion`);
  }

  agregarEducacion(id: number, request: AgregarEducacionRequest): Observable<PilotoEducacionResponse> {
    return this.http.post<PilotoEducacionResponse>(`${this.apiUrl}/${id}/educacion`, request);
  }

  eliminarEducacion(idPiloto: number, idEducacion: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${idPiloto}/educacion/${idEducacion}`);
  }

  // Residencia
  obtenerResidencia(id: number): Observable<PilotoResidenciaResponse> {
    return this.http.get<PilotoResidenciaResponse>(`${this.apiUrl}/${id}/residencia`);
  }

  guardarResidencia(id: number, request: GuardarResidenciaRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}/residencia`, request);
  }
}
