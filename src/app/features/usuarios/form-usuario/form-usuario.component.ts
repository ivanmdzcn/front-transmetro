import { Component, OnInit }              from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService }                 from '../../../core/services/usuario.service';
import { RolService }                     from '../../../core/services/rol.service';
import { ObtenerTodosRolesResponse }      from '../../../core/models/rol.models';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.scss'
})
export class FormUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  isEditMode  = false;
  usuarioId: number | null = null;
  loading     = false;
  errorMsg    = '';

  roles: ObtenerTodosRolesResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombre:        ['', [Validators.required, Validators.minLength(3)]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      email:         ['', [Validators.required, Validators.email]],
      contrasena:    ['', [Validators.required, Validators.minLength(6)]],
      rolId:         [null]
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.usuarioId  = Number(idParam);
      this.usuarioForm.get('nombreUsuario')!.disable();
      this.usuarioForm.get('contrasena')!.clearValidators();
      this.usuarioForm.get('contrasena')!.updateValueAndValidity();
      this.cargarUsuario();
    }
  }

  cargarRoles(): void {
    this.rolService.obtenerActivos().subscribe({
      next: (data) => this.roles = data,
      error: () => { /* selector quedará vacío, no bloquea el flujo */ }
    });
  }

  cargarUsuario(): void {
    this.loading = true;
    this.usuarioService.obtenerPorId(this.usuarioId!).subscribe({
      next: (u) => {
        this.usuarioForm.patchValue({
          nombre:        u.nombre,
          nombreUsuario: u.nombreUsuario,
          email:         u.email,
          rolId:         u.rolId
        });
        this.loading = false;
      },
      error: () => { this.errorMsg = 'No se pudo cargar el usuario.'; this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) { this.usuarioForm.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';

    if (this.isEditMode) {
      this.usuarioService.actualizar(this.usuarioId!, {
        nombre: this.usuarioForm.value.nombre,
        email:  this.usuarioForm.value.email,
        rolId:  this.usuarioForm.value.rolId
      }).subscribe({
        next:  () => this.router.navigate(['/usuarios']),
        error: (err) => { this.loading = false; this.errorMsg = err.error?.mensaje || 'Error al actualizar.'; }
      });
    } else {
      this.usuarioService.crear(this.usuarioForm.value).subscribe({
        next:  () => this.router.navigate(['/usuarios']),
        error: (err) => { this.loading = false; this.errorMsg = err.error?.mensaje || 'Error al crear.'; }
      });
    }
  }

  get f() { return this.usuarioForm.controls; }
}
