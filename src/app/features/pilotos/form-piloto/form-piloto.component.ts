import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PilotoService } from '../../../core/services/piloto.service';

@Component({
  selector: 'app-form-piloto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-piloto.component.html'
})
export class FormPilotoComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idPiloto  = 0;
  errorMsg  = '';

  constructor(
    private fb: FormBuilder,
    private pilotoService: PilotoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:   ['', Validators.required],
      apellido: ['', Validators.required],
      dpi:      ['', Validators.required],
      telefono: [''],
      email:    ['', Validators.email]
    });
  }

  ngOnInit(): void {
    this.idPiloto = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idPiloto) {
      this.esEdicion = true;
      this.pilotoService.obtenerPorId(this.idPiloto).subscribe({
        next: (p) => this.form.patchValue(p)
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.esEdicion) {
      this.pilotoService.actualizar(this.idPiloto, this.form.value).subscribe({
        next: () => this.router.navigate(['/pilotos']),
        error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
      });
      return;
    }

    this.pilotoService.crear(this.form.value).subscribe({
      next: () => this.router.navigate(['/pilotos']),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
    });
  }

  get f() { return this.form.controls; }
}
