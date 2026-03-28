export interface ObtenerPermisosUsuarioResponse {
  permisoId: number;
  nombre: string;
  nombreModulo: string;
  concedido: boolean;
}

export interface PermisosResueltosResponse {
  id: number;
  nombre: string;
  nombreModulo: string;
  tienePermiso: boolean;
}

export interface AsignarOverrideRequest {
  permisoId: number;
  concedido: boolean;
}

/** Vista combinada para la UI (derivada de resueltos + overrides) */
export interface PermisoConEstado {
  id: number;
  nombre: string;
  modulo: string;
  tieneOverride: boolean;
  overrideConcedido: boolean;
  permisoFinal: boolean;
}
