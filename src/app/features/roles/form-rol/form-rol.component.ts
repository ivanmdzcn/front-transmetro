import { Component, OnInit }              from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RolService }                     from '../../../core/services/rol.service';

@Component({
  selector: 'app-form-rol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-rol.component.html',
  styleUrl: './form-rol.component.scss'
})
export class FormRolComponent implements OnInit {
  rolForm: FormGroup;
  isEditMode = false;
  rolId: number | null = null;
  loading    = false;
  errorMsg   = '';

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rolForm = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.rolId      = Number(idParam);
      this.cargarRol();
    }
  }

  cargarRol(): void {
    this.loading = true;
    this.rolService.obtenerPorId(this.rolId!).subscribe({
      next: (r) => {
        this.rolForm.patchValue({ nombre: r.nombre, descripcion: r.descripcion });
        this.loading = false;
      },
      error: () => { this.errorMsg = 'No se pudo cargar el rol.'; this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.rolForm.invalid) { this.rolForm.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';

    const obs = this.isEditMode
      ? this.rolService.actualizar(this.rolId!, this.rolForm.value)
      : this.rolService.crear(this.rolForm.value);

    obs.subscribe({
      next:  () => this.router.navigate(['/roles']),
      error: (err) => { this.loading = false; this.errorMsg = err.error?.mensaje || 'Error al guardar el rol.'; }
    });
  }

  get f() { return this.rolForm.controls; }
}
