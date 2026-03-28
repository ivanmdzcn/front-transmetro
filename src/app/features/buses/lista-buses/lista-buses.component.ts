import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BusService } from '../../../core/services/bus.service';
import { LineaService } from '../../../core/services/linea.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerBusResponse } from '../../../core/models/bus.models';
import { ObtenerLineaResponse } from '../../../core/models/linea.models';

@Component({
  selector: 'app-lista-buses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-buses.component.html'
})
export class ListaBusesComponent implements OnInit {
  buses: ObtenerBusResponse[] = [];
  lineas: ObtenerLineaResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeCrear    = false;
  puedeEditar   = false;
  puedeEliminar = false;
  puedeAsignar  = false;

  // Modal asignar línea
  busSeleccionado: ObtenerBusResponse | null = null;
  lineaSeleccionadaId: number | null = null;
  guardandoLinea = false;

  constructor(
    private busService: BusService,
    private lineaService: LineaService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.puedeCrear    = this.auth.tienePermiso('buses.crear');
    this.puedeEditar   = this.auth.tienePermiso('buses.editar');
    this.puedeEliminar = this.auth.tienePermiso('buses.eliminar');
    this.puedeAsignar  = this.auth.tienePermiso('buses.asignar');
    this.cargar();
    if (this.puedeAsignar) {
      this.lineaService.obtenerTodos().subscribe({
        next: (data) => this.lineas = data.filter(l => l.activo)
      });
    }
  }

  cargar(): void {
    this.loading = true;
    this.busService.obtenerTodos().subscribe({
      next: (data) => { this.buses = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar buses.'; this.loading = false; }
    });
  }

  abrirModalLinea(bus: ObtenerBusResponse): void {
    this.busSeleccionado   = bus;
    this.lineaSeleccionadaId = bus.idLinea ?? null;
  }

  guardarLinea(): void {
    if (!this.busSeleccionado) return;
    this.guardandoLinea = true;
    this.busService.asignarLinea(this.busSeleccionado.idBus, { idLinea: this.lineaSeleccionadaId ?? undefined }).subscribe({
      next: () => {
        this.guardandoLinea = false;
        this.busSeleccionado = null;
        this.cargar();
      },
      error: () => { this.guardandoLinea = false; alert('Error al asignar la línea.'); }
    });
  }

  cambiarEstado(bus: ObtenerBusResponse, estado: string): void {
    if (!confirm(`¿Cambiar estado del bus ${bus.numeroUnidad} a "${estado}"?`)) return;
    this.busService.cambiarEstado(bus.idBus, estado).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }

  estadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activo':        return 'bg-success';
      case 'mantenimiento': return 'bg-warning text-dark';
      case 'baja':          return 'bg-danger';
      default:              return 'bg-secondary';
    }
  }
}
