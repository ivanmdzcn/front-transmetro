import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearMunicipalidadRequest,
  ObtenerMunicipalidadResponse,
  ActualizarMunicipalidadRequest
} from '../models/municipalidad.models';

@Injectable({ providedIn: 'root' })
export class MunicipalidadService {
  private readonly apiUrl = `${environment.apiUrl}/municipalidades`;

  constructor(private http: HttpClient) {}

  crear(request: CrearMunicipalidadRequest): Observable<{ idMunicipalidad: number }> {
    return this.http.post<{ idMunicipalidad: number }>(this.apiUrl, request);
  }

  obtenerTodos(): Observable<ObtenerMunicipalidadResponse[]> {
    return this.http.get<ObtenerMunicipalidadResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ObtenerMunicipalidadResponse> {
    return this.http.get<ObtenerMunicipalidadResponse>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, request: ActualizarMunicipalidadRequest): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: number, activo: boolean): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/estado`, activo);
  }
}
