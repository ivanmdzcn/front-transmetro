import { Injectable }  from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConfiguracionEmpresa {
  id?:                       number;
  razonSocial:               string;
  nombreComercial?:          string;
  numeroIdentificacionFiscal?: string;
  direccion:                 string;
  ciudad?:                   string;
  estadoProvincia?:          string;
  codigoPostal?:             string;
  pais:                      string;
  telefonoPrincipal?:        string;
  telefonoSecundario?:       string;
  emailPrincipal:            string;
  emailSecundario?:          string;
  sitioWeb?:                 string;
  codigoMoneda:              string;
  simboloMoneda:             string;
  nombreMoneda?:             string;
  posicionSimbolo:           string;
  separadorMiles:            string;
  separadorDecimales:        string;
  decimales:                 number;
  logoUrl?:                  string;
  colorPrimario?:            string;
  piePaginaDocumentos?:      string;
  mensajeAgradecimiento?:    string;
  fechaCreacion?:            string;
  fechaActualizacion?:       string;
  actualizadoPor?:           number;
}

export interface ActualizarConfiguracionRequest {
  razonSocial:               string;
  nombreComercial?:          string | null;
  numeroIdentificacionFiscal?: string | null;
  direccion:                 string;
  ciudad?:                   string | null;
  estadoProvincia?:          string | null;
  codigoPostal?:             string | null;
  pais:                      string;
  telefonoPrincipal?:        string | null;
  telefonoSecundario?:       string | null;
  emailPrincipal:            string;
  emailSecundario?:          string | null;
  sitioWeb?:                 string | null;
  codigoMoneda:              string;
  simboloMoneda:             string;
  nombreMoneda?:             string | null;
  posicionSimbolo:           string;
  separadorMiles:            string;
  separadorDecimales:        string;
  decimales:                 number;
  logoUrl?:                  string | null;
  colorPrimario?:            string | null;
  piePaginaDocumentos?:      string | null;
  mensajeAgradecimiento?:    string | null;
}

@Injectable({ providedIn: 'root' })
export class ConfiguracionEmpresaService {
  private readonly apiUrl = `${environment.apiUrl}/ConfiguracionEmpresa`;

  constructor(private http: HttpClient) {}

  obtener(): Observable<ConfiguracionEmpresa> {
    return this.http.get<ConfiguracionEmpresa>(this.apiUrl);
  }

  actualizar(req: ActualizarConfiguracionRequest): Observable<void> {
    return this.http.put<void>(this.apiUrl, req);
  }
}
