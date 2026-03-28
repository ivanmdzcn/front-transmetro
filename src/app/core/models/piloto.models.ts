export interface CrearPilotoRequest {
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  email?: string;
}

export interface ObtenerPilotoResponse {
  idPiloto: number;
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  email?: string;
  idBus?: number;
  numeroUnidad?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarPilotoRequest {
  nombre: string;
  apellido: string;
  dpi: string;
  telefono?: string;
  email?: string;
}

export interface AsignarBusPilotoRequest {
  idBus?: number;
}

export interface PilotoEducacionResponse {
  idEducacion: number;
  idPiloto: number;
  nivel: string;
  titulo: string;
  anioGraduacion: number;
  createdAt: string;
}

export interface AgregarEducacionRequest {
  nivel: string;
  titulo: string;
  anioGraduacion: number;
}

export interface PilotoResidenciaResponse {
  idResidencia: number;
  idPiloto: number;
  direccion: string;
  municipio: string;
  departamento: string;
}

export interface GuardarResidenciaRequest {
  direccion: string;
  municipio: string;
  departamento: string;
}
