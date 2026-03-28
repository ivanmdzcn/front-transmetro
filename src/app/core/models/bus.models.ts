export interface CrearBusRequest {
  numeroUnidad: string;
  capacidadMaxima: number;
  idParqueo: number;
  idLinea?: number;
}

export interface ObtenerBusResponse {
  idBus: number;
  numeroUnidad: string;
  capacidadMaxima: number;
  idLinea?: number;
  nombreLinea?: string;
  idParqueo: number;
  nombreParqueo: string;
  estado: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarBusRequest {
  numeroUnidad: string;
  capacidadMaxima: number;
  idParqueo: number;
}

export interface AsignarLineaBusRequest {
  idLinea?: number;
}

export interface CambiarParqueoRequest {
  idParqueoNuevo: number;
  idUsuario: number;
}

export interface BusParqueoHistorialResponse {
  idHistorial: number;
  idBus: number;
  idParqueoAnterior: number;
  nombreParqueoAnterior?: string;
  idParqueoNuevo: number;
  nombreParqueoNuevo?: string;
  fechaCambio: string;
  idUsuario: number;
  nombreUsuario?: string;
}
