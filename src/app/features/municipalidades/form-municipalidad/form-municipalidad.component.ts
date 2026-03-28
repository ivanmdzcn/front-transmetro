import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MunicipalidadService } from '../../../core/services/municipalidad.service';

@Component({
  selector: 'app-form-municipalidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-municipalidad.component.html'
})
export class FormMunicipalidadComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;
  loading  = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private service: MunicipalidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:       ['', [Validators.required, Validators.minLength(2)]],
      departamento: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = Number(id);
      this.loading = true;
      this.service.obtenerPorId(this.itemId).subscribe({
        next: (data) => { this.form.patchValue(data); this.loading = false; },
        error: () => { this.errorMsg = 'No se pudo cargar la municipalidad.'; this.loading = false; }
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';
    const value = this.form.value;

    if (this.isEditMode) {
      this.service.actualizar(this.itemId!, value).subscribe({
        next: () => this.router.navigate(['/municipalidades']),
        error: (err) => {
          this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.';
          this.loading  = false;
        }
      });
      return;
    }

    this.service.crear(value).subscribe({
      next: () => this.router.navigate(['/municipalidades']),
      error: (err) => {
        this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.';
        this.loading  = false;
      }
    });
  }
}
