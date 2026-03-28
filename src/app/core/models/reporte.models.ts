export interface ReporteBusesPorLineaResponse {
  idLinea: number;
  nombreLinea: string;
  totalBuses: number;
  busesActivos: number;
  busesMantenimiento: number;
  busesBaja: number;
}

export interface ReporteRecorridosResponse {
  idRecorrido: number;
  numeroUnidad: string;
  nombreLinea: string;
  nombrePiloto: string;
  apellidoPiloto: string;
  pasajerosIda: number;
  pasajerosVuelta?: number;
  totalPasajeros?: number;
  fechaSalida: string;
  fechaLlegada?: string;
  tiempoEsperaExtra?: number;
  estado: string;
}

export interface ReporteAlertasResponse {
  idAlerta: number;
  idRecorrido: number;
  numeroUnidad: string;
  tipo: string;
  descripcion: string;
  resuelta: boolean;
  createdAt: string;
  resueltaAt?: string;
}

export interface ReporteOcupacionResponse {
  idBus: number;
  numeroUnidad: string;
  capacidadMaxima: number;
  totalRecorridos: number;
  promedioOcupacionIda: number;
  promedioOcupacionVuelta?: number;
  porcentajeOcupacionIda: number;
}

export interface ReporteEstacionesPorLineaResponse {
  idLinea: number;
  nombreLinea: string;
  nombreMunicipalidad: string;
  totalEstaciones: number;
  distanciaTotalKm?: number;
}

export interface ReporteLineasPorMunicipalidadResponse {
  idMunicipalidad: number;
  nombreMunicipalidad: string;
  totalLineas: number;
  totalBuses: number;
  totalEstaciones: number;
}
