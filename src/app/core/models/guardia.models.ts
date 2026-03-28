export interface CrearGuardiaRequest {
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
}

export interface ObtenerGuardiaResponse {
  idGuardia: number;
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  idAcceso?: number;
  descripcionAcceso?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarGuardiaRequest {
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
}

export interface GuardiaAccesoResponse {
  idGuardiaAcceso: number;
  idGuardia: number;
  nombreGuardia?: string;
  apellidoGuardia?: string;
  idAcceso: number;
  descripcionAcceso?: string;
  activo: boolean;
}

export interface AsignarAccesoGuardiaRequest {
  idAcceso: number;
}
