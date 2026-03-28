export interface CrearMunicipalidadRequest {
  nombre: string;
  departamento: string;
}

export interface ObtenerMunicipalidadResponse {
  idMunicipalidad: number;
  nombre: string;
  departamento: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarMunicipalidadRequest {
  nombre: string;
  departamento: string;
}
