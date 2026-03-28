import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ReporteBusesPorLineaResponse,
  ReporteRecorridosResponse,
  ReporteAlertasResponse,
  ReporteOcupacionResponse,
  ReporteEstacionesPorLineaResponse,
  ReporteLineasPorMunicipalidadResponse
} from '../models/reporte.models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  busesPorLinea(): Observable<ReporteBusesPorLineaResponse[]> {
    return this.http.get<ReporteBusesPorLineaResponse[]>(`${this.apiUrl}/buses-por-linea`);
  }

  recorridosPorPeriodo(
    desde: string,
    hasta: string,
    idBus?: number,
    idLinea?: number
  ): Observable<ReporteRecorridosResponse[]> {
    const params: any = { desde, hasta };
    if (idBus)   params['idBus']   = idBus;
    if (idLinea) params['idLinea'] = idLinea;
    return this.http.get<ReporteRecorridosResponse[]>(`${this.apiUrl}/recorridos`, { params });
  }

  alertasPorPeriodo(
    desde: string,
    hasta: string,
    tipo?: string
  ): Observable<ReporteAlertasResponse[]> {
    const params: any = { desde, hasta };
    if (tipo) params['tipo'] = tipo;
    return this.http.get<ReporteAlertasResponse[]>(`${this.apiUrl}/alertas`, { params });
  }

  ocupacionPromedio(desde: string, hasta: string): Observable<ReporteOcupacionResponse[]> {
    return this.http.get<ReporteOcupacionResponse[]>(`${this.apiUrl}/ocupacion`, { params: { desde, hasta } });
  }

  estacionesPorLinea(): Observable<ReporteEstacionesPorLineaResponse[]> {
    return this.http.get<ReporteEstacionesPorLineaResponse[]>(`${this.apiUrl}/estaciones-por-linea`);
  }

  lineasPorMunicipalidad(): Observable<ReporteLineasPorMunicipalidadResponse[]> {
    return this.http.get<ReporteLineasPorMunicipalidadResponse[]>(`${this.apiUrl}/lineas-por-municipalidad`);
  }
}
