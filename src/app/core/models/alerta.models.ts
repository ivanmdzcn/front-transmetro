export interface ObtenerAlertaResponse {
  idAlerta: number;
  idRecorrido: number;
  numeroUnidad?: string;
  tipo: string;
  descripcion: string;
  resuelta: boolean;
  createdAt: string;
  resueltaAt?: string;
}
