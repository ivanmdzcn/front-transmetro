export interface CrearAccesoRequest {
  descripcion: string;
  idEstacion: number;
}

export interface ObtenerAccesoResponse {
  idAcceso: number;
  descripcion: string;
  idEstacion: number;
  nombreEstacion: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarAccesoRequest {
  descripcion: string;
  idEstacion: number;
}

export interface ObtenerGuardiasAccesoResponse {
  idGuardia: number;
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  activo: boolean;
}
