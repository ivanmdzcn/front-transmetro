import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OperadorService } from '../../../core/services/operador.service';

@Component({
  selector: 'app-form-operador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-operador.component.html'
})
export class FormOperadorComponent implements OnInit {
  form: FormGroup;
  esEdicion = false;
  idOperador = 0;
  errorMsg   = '';

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
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
    this.idOperador = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idOperador) {
      this.esEdicion = true;
      this.operadorService.obtenerPorId(this.idOperador).subscribe({
        next: (o) => this.form.patchValue(o)
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.esEdicion) {
      this.operadorService.actualizar(this.idOperador, this.form.value).subscribe({
        next: () => this.router.navigate(['/operadores']),
        error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
      });
      return;
    }

    this.operadorService.crear(this.form.value).subscribe({
      next: () => this.router.navigate(['/operadores']),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al guardar.'; }
    });
  }

  get f() { return this.form.controls; }
}
