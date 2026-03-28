import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LineaService } from '../../../core/services/linea.service';
import { MunicipalidadService } from '../../../core/services/municipalidad.service';
import { ObtenerMunicipalidadResponse } from '../../../core/models/municipalidad.models';

@Component({
  selector: 'app-form-linea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-linea.component.html'
})
export class FormLineaComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;
  loading  = false;
  errorMsg = '';
  municipalidades: ObtenerMunicipalidadResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private service: LineaService,
    private municipalidadService: MunicipalidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:          ['', [Validators.required, Validators.minLength(2)]],
      descripcion:     [''],
      idMunicipalidad: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.municipalidadService.obtenerTodos().subscribe({
      next: (data) => this.municipalidades = data.filter(m => m.activo)
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = Number(id);
      this.loading = true;
      this.service.obtenerPorId(this.itemId).subscribe({
        next: (data) => {
          this.form.patchValue({ nombre: data.nombre, descripcion: data.descripcion, idMunicipalidad: data.idMunicipalidad });
          this.loading = false;
        },
        error: () => { this.errorMsg = 'No se pudo cargar la línea.'; this.loading = false; }
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
        next: () => this.router.navigate(['/lineas']),
        error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; this.loading = false; }
      });
      return;
    }

    this.service.crear(this.form.value).subscribe({
      next: () => this.router.navigate(['/lineas']),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; this.loading = false; }
    });
  }
}
