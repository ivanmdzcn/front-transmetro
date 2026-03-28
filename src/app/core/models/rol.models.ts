export interface CrearRolRequest {
  nombre: string;
  descripcion?: string;
}

export interface CrearRolResponse {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ObtenerRolResponse {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ObtenerTodosRolesResponse {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ActualizarRolRequest {
  nombre: string;
  descripcion?: string;
}

export interface ActualizarRolResponse {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}
