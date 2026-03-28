import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LineaService } from '../../../core/services/linea.service';
import { EstacionService } from '../../../core/services/estacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { LineaEstacionResponse, DistanciaLineaResponse, AccesoPorLineaResponse } from '../../../core/models/linea.models';
import { ObtenerEstacionResponse } from '../../../core/models/estacion.models';

@Component({
  selector: 'app-estaciones-linea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './estaciones-linea.component.html'
})
export class EstacionesLineaComponent implements OnInit {
  idLinea = 0;
  nombreLinea = '';
  estacionesLinea: LineaEstacionResponse[] = [];
  estacionesDisponibles: ObtenerEstacionResponse[] = [];
  distancia?: DistanciaLineaResponse;
  accesos: AccesoPorLineaResponse[] = [];
  activeTab: 'estaciones' | 'accesos' = 'estaciones';
  loading  = false;
  loadingAccesos = false;
  errorMsg = '';
  puedeEditar = false;
  mostrarForm = false;

  // Edición inline de distancia
  editingId: number | null = null;
  editingValue: number | null = null;

  asignarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private lineaService: LineaService,
    private estacionService: EstacionService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.asignarForm = this.fb.group({
      idEstacion:           [null, Validators.required],
      orden:                [null, [Validators.required, Validators.min(1)]],
      distanciaSiguienteKm: [null, [Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.puedeEditar = this.auth.tienePermiso('lineas.editar');
    this.idLinea = Number(this.route.snapshot.paramMap.get('id'));
    this.lineaService.obtenerPorId(this.idLinea).subscribe({
      next: (l) => this.nombreLinea = l.nombre
    });
    this.estacionService.obtenerTodos().subscribe({
      next: (data) => this.estacionesDisponibles = data.filter(e => e.activo)
    });
    this.cargar();
    this.cargarDistancia();
  }

  cargar(): void {
    this.loading = true;
    this.lineaService.obtenerEstaciones(this.idLinea).subscribe({
      next: (data) => { this.estacionesLinea = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar estaciones.'; this.loading = false; }
    });
  }

  cargarDistancia(): void {
    this.lineaService.obtenerDistancia(this.idLinea).subscribe({
      next: (d) => this.distancia = d,
      error: () => {}
    });
  }

  cargarAccesos(): void {
    this.loadingAccesos = true;
    this.lineaService.obtenerAccesosPorLinea(this.idLinea).subscribe({
      next: (data) => { this.accesos = data; this.loadingAccesos = false; },
      error: () => { this.loadingAccesos = false; }
    });
  }

  setTab(tab: 'estaciones' | 'accesos'): void {
    this.activeTab = tab;
    if (tab === 'accesos' && this.accesos.length === 0) this.cargarAccesos();
  }

  asignar(): void {
    if (this.asignarForm.invalid) { this.asignarForm.markAllAsTouched(); return; }
    this.lineaService.asignarEstacion(this.idLinea, this.asignarForm.value).subscribe({
      next: () => { this.mostrarForm = false; this.asignarForm.reset(); this.cargar(); this.cargarDistancia(); },
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al asignar.'; }
    });
  }

  quitar(idLineaEstacion: number): void {
    if (!confirm('¿Quitar esta estación de la línea?')) return;
    this.lineaService.quitarEstacion(this.idLinea, idLineaEstacion).subscribe({
      next: () => { this.cargar(); this.cargarDistancia(); },
      error: () => alert('Error al quitar la estación.')
    });
  }

  startEdit(le: LineaEstacionResponse): void {
    this.editingId    = le.idLineaEstacion;
    this.editingValue = le.distanciaSiguienteKm ?? null;
  }

  cancelEdit(): void {
    this.editingId    = null;
    this.editingValue = null;
  }

  saveDistancia(idLineaEstacion: number): void {
    this.lineaService.actualizarDistancia(this.idLinea, idLineaEstacion, this.editingValue).subscribe({
      next: () => { this.cancelEdit(); this.cargar(); this.cargarDistancia(); },
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al actualizar la distancia.'; }
    });
  }

  get f() { return this.asignarForm.controls; }
}
