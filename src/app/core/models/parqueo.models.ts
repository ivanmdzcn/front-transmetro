export interface CrearParqueoRequest {
  nombre: string;
  capacidad: number;
  idEstacion: number;
}

export interface ObtenerParqueoResponse {
  idParqueo: number;
  nombre: string;
  capacidad: number;
  idEstacion: number;
  nombreEstacion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarParqueoRequest {
  nombre: string;
  capacidad: number;
  idEstacion: number;
}
