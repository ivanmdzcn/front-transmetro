import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReporteService } from '../../../core/services/reporte.service';
import {
  ReporteBusesPorLineaResponse,
  ReporteRecorridosResponse,
  ReporteAlertasResponse,
  ReporteOcupacionResponse,
  ReporteEstacionesPorLineaResponse,
  ReporteLineasPorMunicipalidadResponse
} from '../../../core/models/reporte.models';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
  activeTab: 'buses' | 'recorridos' | 'alertas' | 'ocupacion' | 'estaciones' | 'municipalidades' = 'buses';

  busesPorLinea: ReporteBusesPorLineaResponse[] = [];
  recorridos: ReporteRecorridosResponse[] = [];
  alertas: ReporteAlertasResponse[] = [];
  ocupacion: ReporteOcupacionResponse[] = [];
  estacionesPorLinea: ReporteEstacionesPorLineaResponse[] = [];
  lineasPorMunicipalidad: ReporteLineasPorMunicipalidadResponse[] = [];

  loadingBuses      = false;
  loadingRecorridos = false;
  loadingAlertas    = false;
  loadingOcupacion  = false;
  loadingEstaciones = false;
  loadingMunicipalidades = false;

  filtroRecorridos: FormGroup;
  filtroAlertas: FormGroup;
  filtroOcupacion: FormGroup;

  constructor(private fb: FormBuilder, private reporteService: ReporteService) {
    const hoy = new Date().toISOString().substring(0, 10);
    const mesAtras = new Date(Date.now() - 30 * 86400000).toISOString().substring(0, 10);

    this.filtroRecorridos = this.fb.group({
      desde: [mesAtras, Validators.required],
      hasta: [hoy, Validators.required]
    });
    this.filtroAlertas = this.fb.group({
      desde: [mesAtras, Validators.required],
      hasta: [hoy, Validators.required],
      tipo:  ['']
    });
    this.filtroOcupacion = this.fb.group({
      desde: [mesAtras, Validators.required],
      hasta: [hoy, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarBusesPorLinea();
  }

  cargarBusesPorLinea(): void {
    this.loadingBuses = true;
    this.reporteService.busesPorLinea().subscribe({
      next: (d) => { this.busesPorLinea = d; this.loadingBuses = false; },
      error: () => { this.loadingBuses = false; }
    });
  }

  buscarRecorridos(): void {
    if (this.filtroRecorridos.invalid) return;
    const { desde, hasta } = this.filtroRecorridos.value;
    this.loadingRecorridos = true;
    this.reporteService.recorridosPorPeriodo(desde, hasta).subscribe({
      next: (d) => { this.recorridos = d; this.loadingRecorridos = false; },
      error: () => { this.loadingRecorridos = false; }
    });
  }

  buscarAlertas(): void {
    if (this.filtroAlertas.invalid) return;
    const { desde, hasta, tipo } = this.filtroAlertas.value;
    this.loadingAlertas = true;
    this.reporteService.alertasPorPeriodo(desde, hasta, tipo || undefined).subscribe({
      next: (d) => { this.alertas = d; this.loadingAlertas = false; },
      error: () => { this.loadingAlertas = false; }
    });
  }

  buscarOcupacion(): void {
    if (this.filtroOcupacion.invalid) return;
    const { desde, hasta } = this.filtroOcupacion.value;
    this.loadingOcupacion = true;
    this.reporteService.ocupacionPromedio(desde, hasta).subscribe({
      next: (d) => { this.ocupacion = d; this.loadingOcupacion = false; },
      error: () => { this.loadingOcupacion = false; }
    });
  }

  cargarEstacionesPorLinea(): void {
    this.loadingEstaciones = true;
    this.reporteService.estacionesPorLinea().subscribe({
      next: (d) => { this.estacionesPorLinea = d; this.loadingEstaciones = false; },
      error: () => { this.loadingEstaciones = false; }
    });
  }

  cargarLineasPorMunicipalidad(): void {
    this.loadingMunicipalidades = true;
    this.reporteService.lineasPorMunicipalidad().subscribe({
      next: (d) => { this.lineasPorMunicipalidad = d; this.loadingMunicipalidades = false; },
      error: () => { this.loadingMunicipalidades = false; }
    });
  }

  setTab(tab: 'buses' | 'recorridos' | 'alertas' | 'ocupacion' | 'estaciones' | 'municipalidades'): void {
    this.activeTab = tab;
    if (tab === 'buses'           && this.busesPorLinea.length === 0)       this.cargarBusesPorLinea();
    if (tab === 'estaciones'      && this.estacionesPorLinea.length === 0)  this.cargarEstacionesPorLinea();
    if (tab === 'municipalidades' && this.lineasPorMunicipalidad.length === 0) this.cargarLineasPorMunicipalidad();
  }

  get fr() { return this.filtroRecorridos.controls; }
  get fa() { return this.filtroAlertas.controls; }
  get fo() { return this.filtroOcupacion.controls; }
}
