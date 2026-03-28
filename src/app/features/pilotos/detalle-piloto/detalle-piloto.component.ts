import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PilotoService } from '../../../core/services/piloto.service';
import { BusService } from '../../../core/services/bus.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ObtenerPilotoResponse,
  PilotoEducacionResponse,
  PilotoResidenciaResponse
} from '../../../core/models/piloto.models';
import { ObtenerBusResponse } from '../../../core/models/bus.models';

@Component({
  selector: 'app-detalle-piloto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detalle-piloto.component.html'
})
export class DetallePilotoComponent implements OnInit {
  idPiloto = 0;
  piloto?: ObtenerPilotoResponse;
  educaciones: PilotoEducacionResponse[] = [];
  residencia?: PilotoResidenciaResponse;
  busesActivos: ObtenerBusResponse[] = [];
  activeTab: 'educacion' | 'residencia' | 'bus' = 'educacion';
  puedeEditar = false;

  educacionForm: FormGroup;
  residenciaForm: FormGroup;
  busForm: FormGroup;

  errorEducacion   = '';
  errorResidencia  = '';
  errorBus         = '';
  mostrarFormEduc  = false;

  constructor(
    private fb: FormBuilder,
    private pilotoService: PilotoService,
    private busService: BusService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.educacionForm = this.fb.group({
      nivel:          ['', Validators.required],
      titulo:         ['', Validators.required],
      anioGraduacion: [null, [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear())]]
    });
    this.residenciaForm = this.fb.group({
      direccion:    ['', Validators.required],
      municipio:    ['', Validators.required],
      departamento: ['', Validators.required]
    });
    this.busForm = this.fb.group({
      idBus: [null]
    });
  }

  ngOnInit(): void {
    this.puedeEditar = this.auth.tienePermiso('pilotos.editar');
    this.idPiloto = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPiloto();
    this.cargarEducacion();
    this.cargarResidencia();
    this.busService.obtenerTodos().subscribe({
      next: (d) => this.busesActivos = d.filter(b => b.activo && b.estado === 'activo')
    });
  }

  cargarPiloto(): void {
    this.pilotoService.obtenerPorId(this.idPiloto).subscribe({
      next: (p) => {
        this.piloto = p;
        this.busForm.patchValue({ idBus: p.idBus ?? null });
      }
    });
  }

  cargarEducacion(): void {
    this.pilotoService.obtenerEducaciones(this.idPiloto).subscribe({
      next: (d) => this.educaciones = d
    });
  }

  cargarResidencia(): void {
    this.pilotoService.obtenerResidencia(this.idPiloto).subscribe({
      next: (d) => {
        this.residencia = d;
        this.residenciaForm.patchValue(d);
      },
      error: () => {}
    });
  }

  agregarEducacion(): void {
    if (this.educacionForm.invalid) { this.educacionForm.markAllAsTouched(); return; }
    this.pilotoService.agregarEducacion(this.idPiloto, this.educacionForm.value).subscribe({
      next: () => { this.mostrarFormEduc = false; this.educacionForm.reset(); this.cargarEducacion(); },
      error: (err) => { this.errorEducacion = err?.error?.mensaje ?? 'Error al agregar.'; }
    });
  }

  eliminarEducacion(idEducacion: number): void {
    if (!confirm('¿Eliminar este registro de educación?')) return;
    this.pilotoService.eliminarEducacion(this.idPiloto, idEducacion).subscribe({
      next: () => this.cargarEducacion(),
      error: () => alert('Error al eliminar.')
    });
  }

  guardarResidencia(): void {
    if (this.residenciaForm.invalid) { this.residenciaForm.markAllAsTouched(); return; }
    this.pilotoService.guardarResidencia(this.idPiloto, this.residenciaForm.value).subscribe({
      next: () => this.cargarResidencia(),
      error: (err) => { this.errorResidencia = err?.error?.mensaje ?? 'Error al guardar.'; }
    });
  }

  asignarBus(): void {
    this.pilotoService.asignarBus(this.idPiloto, { idBus: this.busForm.value.idBus }).subscribe({
      next: () => this.cargarPiloto(),
      error: (err) => { this.errorBus = err?.error?.mensaje ?? 'Error al asignar bus.'; }
    });
  }

  get fe() { return this.educacionForm.controls; }
  get fr() { return this.residenciaForm.controls; }
}
