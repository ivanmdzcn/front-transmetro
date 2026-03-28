export interface CrearUsuarioRequest {
  nombre: string;
  nombreUsuario: string;
  email: string;
  contrasena: string;
  rolId: number | null;
}

export interface CrearUsuarioResponse {
  id: number;
  nombre: string;
  nombreUsuario: string;
  email: string;
  rolId: number | null;
}

export interface ObtenerUsuarioResponse {
  id: number;
  nombre: string;
  nombreUsuario: string;
  email: string;
  rolId: number | null;
  nombreRol: string | null;
  activo: boolean;
}

export interface ObtenerTodosUsuariosResponse {
  id: number;
  nombre: string;
  nombreUsuario: string;
  email: string;
  nombreRol: string | null;
  activo: boolean;
}

export interface ActualizarUsuarioRequest {
  nombre: string;
  email: string;
  rolId: number | null;
}

export interface ActualizarUsuarioResponse {
  id: number;
  nombre: string;
  nombreUsuario: string;
  email: string;
  rolId: number | null;
}
