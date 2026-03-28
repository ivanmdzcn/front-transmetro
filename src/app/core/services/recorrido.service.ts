import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IniciarRecorridoRequest,
  IniciarRecorridoResponse,
  RegistrarLlegadaRequest,
  ObtenerRecorridoResponse,
  RecorridoParadaResponse,
  LlegarEstacionRequest,
  LlegarEstacionResponse,
  SalirEstacionRequest,
  SalirEstacionResponse
} from '../models/recorrido.models';

@Injectable({ providedIn: 'root' })
export class RecorridoService {
  private readonly apiUrl = `${environment.apiUrl}/recorridos`;

  constructor(private http: HttpClient) {}

  iniciar(request: IniciarRecorridoRequest): Observable<IniciarRecorridoResponse> {
    return this.http.post<IniciarRecorridoResponse>(this.apiUrl, request);
  }

  registrarLlegada(id: number, request: RegistrarLlegadaRequest): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/llegada`, {});
  }

  obtenerActivos(): Observable<ObtenerRecorridoResponse[]> {
    return this.http.get<ObtenerRecorridoResponse[]>(`${this.apiUrl}/activos`);
  }

  obtenerTodos(idBus?: number, idLinea?: number): Observable<ObtenerRecorridoResponse[]> {
    const params: any = {};
    if (idBus)   params['idBus']   = idBus;
    if (idLinea) params['idLinea'] = idLinea;
    return this.http.get<ObtenerRecorridoResponse[]>(this.apiUrl, { params });
  }

  obtenerParadas(idRecorrido: number): Observable<RecorridoParadaResponse[]> {
    return this.http.get<RecorridoParadaResponse[]>(`${this.apiUrl}/${idRecorrido}/paradas`);
  }

  llegarEstacion(idRecorrido: number, idEstacion: number, request: LlegarEstacionRequest): Observable<LlegarEstacionResponse> {
    return this.http.post<LlegarEstacionResponse>(
      `${this.apiUrl}/${idRecorrido}/paradas/${idEstacion}/llegar`, {}
    );
  }

  salirEstacion(idRecorrido: number, idEstacion: number, request: SalirEstacionRequest): Observable<SalirEstacionResponse> {
    return this.http.post<SalirEstacionResponse>(
      `${this.apiUrl}/${idRecorrido}/paradas/${idEstacion}/salir`, request
    );
  }
}
