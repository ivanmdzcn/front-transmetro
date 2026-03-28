export interface CrearLineaRequest {
  nombre: string;
  descripcion?: string;
  idMunicipalidad: number;
}

export interface ObtenerLineaResponse {
  idLinea: number;
  nombre: string;
  descripcion?: string;
  idMunicipalidad: number;
  nombreMunicipalidad: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarLineaRequest {
  nombre: string;
  descripcion?: string;
  idMunicipalidad: number;
}

export interface AsignarEstacionRequest {
  idEstacion: number;
  orden: number;
  distanciaSiguienteKm?: number;
}

export interface ActualizarLineaEstacionRequest {
  distanciaSiguienteKm?: number | null;
}

export interface LineaEstacionResponse {
  idLineaEstacion: number;
  idLinea: number;
  idEstacion: number;
  nombreEstacion: string;
  orden: number;
  distanciaSiguienteKm?: number;
  activo: boolean;
}

export interface DistanciaLineaResponse {
  idLinea: number;
  nombreLinea: string;
  totalEstaciones: number;
  distanciaTotalKm?: number;
}

export interface AccesoPorLineaResponse {
  idEstacion: number;
  nombreEstacion: string;
  idAcceso: number;
  descripcion: string;
  activo: boolean;
}
