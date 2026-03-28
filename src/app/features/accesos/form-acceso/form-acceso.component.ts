import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccesoService } from '../../../core/services/acceso.service';
import { EstacionService } from '../../../core/services/estacion.service';
import { ObtenerEstacionResponse } from '../../../core/models/estacion.models';

@Component({
  selector: 'app-form-acceso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-acceso.component.html'
})
export class FormAccesoComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;
  loading  = false;
  errorMsg = '';
  estaciones: ObtenerEstacionResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AccesoService,
    private estacionService: EstacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(2)]],
      idEstacion:  [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.estacionService.obtenerTodos().subscribe({
      next: (data) => this.estaciones = data.filter(e => e.activo)
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = Number(id);
      this.loading = true;
      this.service.obtenerPorId(this.itemId).subscribe({
        next: (data) => { this.form.patchValue(data); this.loading = false; },
        error: () => { this.errorMsg = 'No se pudo cargar el acceso.'; this.loading = false; }
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';

    if (this.isEditMode) {
      this.service.actualizar(this.itemId!, this.form.value).subscribe({
        next: () => this.router.navigate(['/accesos']),
        error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; this.loading = false; }
      });
      return;
    }

    this.service.crear(this.form.value).subscribe({
      next: () => this.router.navigate(['/accesos']),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; this.loading = false; }
    });
  }
}
