import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../core/services/reporte.service';
import { BusService } from '../../../core/services/bus.service';
import { ReporteBusesPorLineaResponse, ReporteLineasPorMunicipalidadResponse } from '../../../core/models/reporte.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  busesPorLinea: ReporteBusesPorLineaResponse[] = [];
  lineasPorMunicipalidad: ReporteLineasPorMunicipalidadResponse[] = [];

  loadingBuses = false;
  loadingResumen = false;
  loadingMunicipalidades = false;

  totalBusesActivos = 0;
  totalMantenimiento = 0;
  totalBaja = 0;

  constructor(
    private reporteService: ReporteService,
    private busService: BusService
  ) {}

  ngOnInit(): void {
    this.cargarResumenBuses();
    this.cargarBusesPorLinea();
    this.cargarLineasPorMunicipalidad();
  }

  private cargarResumenBuses(): void {
    this.loadingResumen = true;
    this.busService.obtenerTodos().subscribe({
      next: (data) => {
        this.totalBusesActivos  = data.filter(b => b.estado === 'activo').length;
        this.totalMantenimiento = data.filter(b => b.estado === 'mantenimiento').length;
        this.totalBaja          = data.filter(b => b.estado === 'baja').length;
        this.loadingResumen = false;
      },
      error: () => { this.loadingResumen = false; }
    });
  }

  private cargarBusesPorLinea(): void {
    this.loadingBuses = true;
    this.reporteService.busesPorLinea().subscribe({
      next: (data) => { this.busesPorLinea = data; this.loadingBuses = false; },
      error: () => { this.loadingBuses = false; }
    });
  }

  private cargarLineasPorMunicipalidad(): void {
    this.loadingMunicipalidades = true;
    this.reporteService.lineasPorMunicipalidad().subscribe({
      next: (data) => { this.lineasPorMunicipalidad = data; this.loadingMunicipalidades = false; },
      error: () => { this.loadingMunicipalidades = false; }
    });
  }
}
