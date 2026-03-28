import { Component, OnInit }      from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PermisoService, ModuloItem } from '../../../core/services/permiso.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-form-permiso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-permiso.component.html',
  styleUrl: './form-permiso.component.scss'
})
export class FormPermisoComponent implements OnInit {
  form!:    FormGroup;
  modulos:  ModuloItem[] = [];
  editando  = false;
  permisoId = 0;
  loading   = false;
  errorMsg  = '';

  constructor(
    private fb:     FormBuilder,
    private route:  ActivatedRoute,
    private router: Router,
    private permisoService: PermisoService
  ) {
    this.form = this.fb.group({
      nombre:   ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      moduloId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando  = true;
      this.permisoId = Number(id);
    }

    if (this.editando) {
      this.loading = true;
      forkJoin({
        modulos:  this.permisoService.obtenerModulos(),
        permiso:  this.permisoService.obtenerPorId(this.permisoId)
      }).subscribe({
        next: ({ modulos, permiso }) => {
          this.modulos = modulos;
          this.form.patchValue({
            nombre:   permiso.nombre,
            moduloId: permiso.moduloId
          });
          this.loading = false;
        },
        error: () => { this.errorMsg = 'Error al cargar datos.'; this.loading = false; }
      });
    } else {
      this.permisoService.obtenerModulos().subscribe({
        next:  (m) => this.modulos = m,
        error: ()  => this.errorMsg = 'Error al cargar m\u00f3dulos.'
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const req = this.form.value;

    const cb = {
      next:  () => this.router.navigate(['/permisos']),
      error: (err: { error?: { mensaje?: string } }) => {
        this.errorMsg = err.error?.mensaje || 'Error al guardar.';
        this.loading  = false;
      }
    };

    if (this.editando) {
      this.permisoService.actualizar(this.permisoId, req).subscribe(cb);
    } else {
      this.permisoService.crear(req).subscribe(cb);
    }
  }
}
