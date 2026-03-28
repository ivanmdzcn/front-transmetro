export interface ObtenerPermisosPorRolResponse {
  permisoId: number;
  nombre: string;
  nombreModulo: string;
}

export interface PermisoDisponible {
  id: number;
  nombre: string;
  moduloId: number;
  modulo: string;
}

export interface PermisoConAsignacion extends PermisoDisponible {
  asignado: boolean;
}
