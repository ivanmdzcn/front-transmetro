import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecorridoService } from '../../../core/services/recorrido.service';
import {
  RecorridoParadaResponse,
  LlegarEstacionResponse,
  SalirEstacionResponse
} from '../../../core/models/recorrido.models';

@Component({
  selector: 'app-paradas-recorrido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './paradas-recorrido.component.html'
})
export class ParadasRecorridoComponent implements OnInit {
  idRecorrido!: number;
  paradas: RecorridoParadaResponse[] = [];
  loading = false;
  errorMsg = '';

  // Panel llegada (sin form, solo confirmar)
  paradaLlegadaSeleccionada: RecorridoParadaResponse | null = null;
  llegadaResult: LlegarEstacionResponse | null = null;
  errorLlegada = '';
  loadingLlegada = false;

  // Panel salida
  paradaSalidaSeleccionada: RecorridoParadaResponse | null = null;
  salidaForm!: FormGroup;
  salidaResult: SalirEstacionResponse | null = null;
  errorSalida = '';
  loadingSalida = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recorridoService: RecorridoService
  ) {}

  ngOnInit(): void {
    this.idRecorrido = Number(this.route.snapshot.paramMap.get('id'));
    this.salidaForm = this.fb.group({
      pasajerosSuben: [0, [Validators.required, Validators.min(0)]],
      pasajerosBajan: [0, [Validators.required, Validators.min(0)]]
    });
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.recorridoService.obtenerParadas(this.idRecorrido).subscribe({
      next: (data) => { this.paradas = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar paradas.'; this.loading = false; }
    });
  }

  // Llegada
  abrirLlegada(parada: RecorridoParadaResponse): void {
    this.paradaLlegadaSeleccionada = parada;
    this.llegadaResult = null;
    this.errorLlegada = '';
  }

  confirmarLlegada(): void {
    if (!this.paradaLlegadaSeleccionada) return;
    this.loadingLlegada = true;
    this.recorridoService.llegarEstacion(this.idRecorrido, this.paradaLlegadaSeleccionada.idEstacion, {}).subscribe({
      next: (res) => {
        this.llegadaResult = res;
        this.loadingLlegada = false;
        this.cargar();
      },
      error: (err) => { this.errorLlegada = err?.error?.mensaje ?? 'Error.'; this.loadingLlegada = false; }
    });
  }

  cerrarLlegada(): void { this.paradaLlegadaSeleccionada = null; this.llegadaResult = null; }

  // Salida
  abrirSalida(parada: RecorridoParadaResponse): void {
    this.paradaSalidaSeleccionada = parada;
    this.salidaResult = null;
    this.errorSalida = '';
    this.salidaForm.reset({ pasajerosSuben: 0, pasajerosBajan: 0 });
  }

  /** Salida de estación intermedia / destino (con formulario) */
  confirmarSalida(): void {
    if (this.salidaForm.invalid || !this.paradaSalidaSeleccionada) { this.salidaForm.markAllAsTouched(); return; }
    this.loadingSalida = true;
    this.recorridoService.salirEstacion(this.idRecorrido, this.paradaSalidaSeleccionada.idEstacion, this.salidaForm.value).subscribe({
      next: (res) => {
        this.salidaResult = res;
        this.loadingSalida = false;
        this.cargar();
      },
      error: (err) => { this.errorSalida = err?.error?.mensaje ?? 'Error.'; this.loadingSalida = false; }
    });
  }

  /** Salida de estación de origen: nadie baja, passengers already boarded at init */
  confirmarSalidaOrigen(): void {
    if (!this.paradaSalidaSeleccionada) return;
    this.loadingSalida = true;
    this.recorridoService.salirEstacion(this.idRecorrido, this.paradaSalidaSeleccionada.idEstacion,
      { pasajerosSuben: 0, pasajerosBajan: 0 }).subscribe({
      next: (res) => {
        this.salidaResult = res;
        this.loadingSalida = false;
        this.cargar();
      },
      error: (err) => { this.errorSalida = err?.error?.mensaje ?? 'Error.'; this.loadingSalida = false; }
    });
  }

  cerrarSalida(): void { this.paradaSalidaSeleccionada = null; this.salidaResult = null; }

  estadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'completado': return 'bg-success';
      case 'en_curso':   return 'bg-warning text-dark';
      case 'pendiente':  return 'bg-secondary';
      default:           return 'bg-secondary';
    }
  }

  estacionBadgeClass(estado: string): string {
    switch (estado) {
      case 'saturado': return 'bg-danger';
      case 'normal':   return 'bg-warning text-dark';
      case 'bajo':     return 'bg-primary';
      default:         return 'bg-secondary';
    }
  }

  /** Solo se puede registrar llegada si la parada anterior ya está completada */
  puedeRegistrarLlegada(parada: RecorridoParadaResponse): boolean {
    if (parada.estado !== 'pendiente') return false;
    if (parada.numeroParada === 1) return true;
    const anterior = this.paradas.find(p => p.numeroParada === parada.numeroParada - 1);
    return anterior?.estado === 'completado';
  }

  get fs() { return this.salidaForm.controls; }
}
