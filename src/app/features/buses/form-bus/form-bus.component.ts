import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BusService } from '../../../core/services/bus.service';
import { ParqueoService } from '../../../core/services/parqueo.service';
import { LineaService } from '../../../core/services/linea.service';
import { ObtenerParqueoResponse } from '../../../core/models/parqueo.models';
import { ObtenerLineaResponse } from '../../../core/models/linea.models';

@Component({
  selector: 'app-form-bus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-bus.component.html'
})
export class FormBusComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idBus = 0;
  errorMsg = '';
  parqueos: ObtenerParqueoResponse[] = [];
  lineas: ObtenerLineaResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private parqueoService: ParqueoService,
    private lineaService: LineaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      numeroUnidad:    ['', Validators.required],
      capacidadMaxima: [null, [Validators.required, Validators.min(1)]],
      idParqueo:       [null, Validators.required],
      idLinea:         [null]
    });
  }

  ngOnInit(): void {
    this.parqueoService.obtenerTodos().subscribe({ next: (d) => this.parqueos = d.filter(p => p.activo) });
    this.lineaService.obtenerTodos().subscribe({ next: (d) => this.lineas = d.filter(l => l.activo) });

    this.idBus = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idBus) {
      this.esEdicion = true;
      this.busService.obtenerPorId(this.idBus).subscribe({
        next: (b) => this.form.patchValue({
          numeroUnidad:    b.numeroUnidad,
          capacidadMaxima: b.capacidadMaxima,
          idParqueo:       b.idParqueo,
          idLinea:         b.idLinea ?? null
        })
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value;
    if (this.esEdicion) {
      this.busService.actualizar(this.idBus, {
        numeroUnidad: payload.numeroUnidad,
        capacidadMaxima: payload.capacidadMaxima,
        idParqueo: payload.idParqueo
      }).subscribe({
        next: () => this.router.navigate(['/buses']),
        error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
      });
      return;
    }

    this.busService.crear(payload).subscribe({
      next: () => this.router.navigate(['/buses']),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
    });
  }

  get f() { return this.form.controls; }
}
