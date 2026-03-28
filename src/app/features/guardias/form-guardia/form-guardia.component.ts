import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GuardiaService } from '../../../core/services/guardia.service';

@Component({
  selector: 'app-form-guardia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-guardia.component.html'
})
export class FormGuardiaComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idGuardia = 0;
  errorMsg  = '';

  constructor(
    private fb: FormBuilder,
    private guardiaService: GuardiaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:   ['', Validators.required],
      apellido: ['', Validators.required],
      dpi:      ['', Validators.required],
      telefono: ['']
    });
  }

  ngOnInit(): void {
    this.idGuardia = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idGuardia) {
      this.esEdicion = true;
      this.guardiaService.obtenerPorId(this.idGuardia).subscribe({
        next: (g) => this.form.patchValue(g)
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.esEdicion) {
      this.guardiaService.actualizar(this.idGuardia, this.form.value).subscribe({
        next: () => this.router.navigate(['/guardias']),
        error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
      });
      return;
    }
    this.guardiaService.crear(this.form.value).subscribe({
      next: () => this.router.navigate(['/guardias']),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
    });
  }

  get f() { return this.form.controls; }
}
