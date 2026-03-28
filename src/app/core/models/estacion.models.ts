export interface CrearEstacionRequest {
  nombre: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  idMunicipalidad: number;
  capacidadMaxima: number;
}

export interface ObtenerEstacionResponse {
  idEstacion: number;
  nombre: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  idMunicipalidad: number;
  nombreMunicipalidad: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarEstacionRequest {
  nombre: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  idMunicipalidad: number;
  capacidadMaxima: number;
}

export interface MonitoreoEstacionResponse {
  idEstacion: number;
  nombre: string;
  capacidadMaxima: number;
  pasajerosActuales: number;
  porcentajeOcupacion: number;
  /** bajo | normal | saturado */
  estadoColor: string;
}
