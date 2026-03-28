export interface CrearOperadorRequest {
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  email?: string;
}

export interface ObtenerOperadorResponse {
  idOperador: number;
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarOperadorRequest {
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  email?: string;
}
