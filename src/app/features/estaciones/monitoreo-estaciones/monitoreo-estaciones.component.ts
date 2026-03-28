import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstacionService } from '../../../core/services/estacion.service';
import { MonitoreoEstacionResponse } from '../../../core/models/estacion.models';

interface EstacionConEdicion extends MonitoreoEstacionResponse {
  loadingDelta?: boolean;
}

@Component({
  selector: 'app-monitoreo-estaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitoreo-estaciones.component.html'
})
export class MonitoreoEstacionesComponent implements OnInit, OnDestroy {
  estaciones: EstacionConEdicion[] = [];
  loading = false;
  errorMsg = '';
  ultimaActualizacion: Date | null = null;

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private estacionService: EstacionService) {}

  ngOnInit(): void {
    this.cargar();
    this.intervalId = setInterval(() => this.cargar(), 30000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  cargar(): void {
    this.loading = true;
    this.estacionService.obtenerMonitoreo().subscribe({
      next: (data) => {
        this.estaciones = data;
        this.ultimaActualizacion = new Date();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar monitoreo de estaciones.';
        this.loading = false;
      }
    });
  }

  get saturadas(): number {
    return this.estaciones.filter(e => e.estadoColor === 'saturado').length;
  }

  get normales(): number {
    return this.estaciones.filter(e => e.estadoColor === 'normal').length;
  }

  get bajas(): number {
    return this.estaciones.filter(e => e.estadoColor === 'bajo').length;
  }

  badgeClass(estado: string): string {
    switch (estado) {
      case 'saturado': return 'bg-danger';
      case 'normal':   return 'bg-warning text-dark';
      case 'bajo':     return 'bg-primary';
      default:         return 'bg-secondary';
    }
  }

  cardBorderClass(estado: string): string {
    switch (estado) {
      case 'saturado': return 'border-danger';
      case 'normal':   return 'border-warning';
      case 'bajo':     return 'border-primary';
      default:         return '';
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case 'saturado': return 'Saturada';
      case 'normal':   return 'Normal';
      case 'bajo':     return 'Baja ocupación';
      default:         return estado;
    }
  }

  ajustarPasajeros(estacion: EstacionConEdicion, delta: number): void {
    estacion.loadingDelta = true;
    this.estacionService.actualizarPasajeros(estacion.idEstacion, delta).subscribe({
      next: (res) => {
        estacion.pasajerosActuales = res.pasajerosActuales;
        estacion.porcentajeOcupacion = estacion.capacidadMaxima > 0
          ? Math.round(res.pasajerosActuales / estacion.capacidadMaxima * 1000) / 10
          : 0;
        if (estacion.porcentajeOcupacion >= 150) estacion.estadoColor = 'saturado';
        else if (estacion.porcentajeOcupacion < 25) estacion.estadoColor = 'bajo';
        else estacion.estadoColor = 'normal';
        estacion.loadingDelta = false;
      },
      error: () => { estacion.loadingDelta = false; }
    });
  }
}
