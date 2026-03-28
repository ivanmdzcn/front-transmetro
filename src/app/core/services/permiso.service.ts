import { Injectable }  from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment } from '../../../environments/environment';
import { PermisoDisponible } from '../models/rol-permiso.models';

export interface CrearPermisoRequest    { nombre: string; moduloId: number; }
export interface ActualizarPermisoRequest { nombre: string; moduloId: number; }
export interface ModuloItem { id: number; nombre: string; }

@Injectable({ providedIn: 'root' })
export class PermisoService {
  private readonly apiUrl     = `${environment.apiUrl}/Permisos`;
  private readonly modulosUrl = `${environment.apiUrl}/Modulos`;

  constructor(private http: HttpClient) {}

  obtenerTodos():                Observable<PermisoDisponible[]>  { return this.http.get<PermisoDisponible[]>(this.apiUrl); }
  obtenerPorId(id: number):      Observable<PermisoDisponible>    { return this.http.get<PermisoDisponible>(`${this.apiUrl}/${id}`); }
  crear(req: CrearPermisoRequest):                Observable<PermisoDisponible> { return this.http.post<PermisoDisponible>(this.apiUrl, req); }
  actualizar(id: number, req: ActualizarPermisoRequest): Observable<void>        { return this.http.put<void>(`${this.apiUrl}/${id}`, req); }
  eliminar(id: number):          Observable<void>                 { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  obtenerModulos():              Observable<ModuloItem[]>         { return this.http.get<ModuloItem[]>(this.modulosUrl); }
}
