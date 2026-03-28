import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ObtenerAlertaResponse } from '../models/alerta.models';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private readonly apiUrl = `${environment.apiUrl}/alertas`;

  constructor(private http: HttpClient) {}

  obtenerActivas(): Observable<ObtenerAlertaResponse[]> {
    return this.http.get<ObtenerAlertaResponse[]>(`${this.apiUrl}/activas`);
  }

  resolver(id: number): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${id}/resolver`, {});
  }
}
