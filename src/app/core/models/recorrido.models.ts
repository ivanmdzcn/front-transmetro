export interface IniciarRecorridoRequest {
  idBus: number;
  idLinea: number;
  idPiloto: number;
  idOperador?: number;
  // pasajerosIda ya no se envía: se calcula desde la estación origen
}

export interface IniciarRecorridoResponse {
  idRecorrido: number;
  idBus: number;
  numeroUnidad: string;
  idLinea: number;
  nombreLinea: string;
  pasajerosEnBus: number;
  estacionOrigen: string;
  estacionDestino: string;
  ruta: string[];
  fechaSalida: string;
  estado: string;
}

// PasajerosVuelta se calcula automáticamente desde la última parada del recorrido
export interface RegistrarLlegadaRequest {}

export interface ObtenerRecorridoResponse {
  idRecorrido: number;
  idBus: number;
  numeroUnidad: string;
  idLinea: number;
  nombreLinea: string;
  idPiloto: number;
  nombrePiloto: string;
  apellidoPiloto: string;
  idOperador?: number;
  nombreOperador?: string;
  apellidoOperador?: string;
  pasajerosIda: number;
  pasajerosVuelta?: number;
  tiempoEsperaExtra?: number;
  fechaSalida: string;
  fechaLlegada?: string;
  estado: string;
}

export interface RecorridoParadaResponse {
  idRecorridoParada: number;
  idEstacion: number;
  nombreEstacion: string;
  numeroParada: number;
  pasajerosEnBus: number;
  pasajerosSuben: number;
  pasajerosBajan: number;
  horaLlegada?: string;
  horaSalida?: string;
  minutosEspera: number;
  /** bajo | normal | saturado */
  estadoEstacion: string;
  /** pendiente | en_curso | completado */
  estado: string;
}

// No body needed: pasajeros_en_bus viene precargado desde la parada anterior
export interface LlegarEstacionRequest {}

export interface LlegarEstacionResponse {
  idRecorridoParada: number;
  idEstacion: number;
  nombreEstacion: string;
  numeroParada: number;
  pasajerosEnBus: number;
  pasajerosActualesEstacion: number;
  capacidadMaximaEstacion: number;
  porcentajeOcupacionEstacion: number;
  estadoEstacion: string;
  minutosEspera: number;
  alerta?: string;
}

export interface SalirEstacionRequest {
  pasajerosSuben: number;
  pasajerosBajan: number;
}

export interface SalirEstacionResponse {
  idRecorridoParada: number;
  idEstacion: number;
  nombreEstacion: string;
  numeroParada: number;
  pasajerosSuben: number;
  pasajerosBajan: number;
  pasajerosEnBusSalida: number;
  nuevoPasajerosEstacion: number;
  horaSalida: string;
  /** Nombre de la siguiente estación, null si es la última */
  siguienteEstacion?: string;
}
