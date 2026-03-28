import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService }       from '../../core/services/auth.service';
import { MiPerfilResponse }  from '../../core/models/auth.models';

function contrasenasIguales(group: AbstractControl): ValidationErrors | null {
  const nueva    = group.get('contrasenaNueva')?.value;
  const confirma = group.get('confirmarContrasena')?.value;
  return nueva && confirma && nueva !== confirma ? { noCoinciden: true } : null;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  perfil: MiPerfilResponse | null = null;
  loading   = true;
  errorMsg  = '';

  // Cambio de contraseña
  passForm!:      FormGroup;
  passGuardando  = false;
  passError      = '';
  passExito      = '';
  mostrarActual  = false;
  mostrarNueva   = false;
  mostrarConfirma = false;

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.auth.getMiPerfil().subscribe({
      next:  (data) => { this.perfil = data; this.loading = false; },
      error: ()     => { this.errorMsg = 'No se pudo cargar el perfil.'; this.loading = false; }
    });

    this.passForm = this.fb.group({
      contrasenaActual:   ['', Validators.required],
      contrasenaNueva:    ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: contrasenasIguales });
  }

  isPassInvalid(campo: string): boolean {
    const ctrl = this.passForm.get(campo);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  cambiarContrasena(): void {
    if (this.passForm.invalid) { this.passForm.markAllAsTouched(); return; }
    this.passGuardando = true;
    this.passError     = '';
    this.passExito     = '';

    const { contrasenaActual, contrasenaNueva } = this.passForm.value;
    this.auth.cambiarContrasena(contrasenaActual, contrasenaNueva).subscribe({
      next: () => {
        this.passExito     = '¡Contraseña actualizada correctamente!';
        this.passGuardando = false;
        this.passForm.reset();
      },
      error: (err) => {
        this.passError     = err.error?.mensaje || 'Error al cambiar la contraseña.';
        this.passGuardando = false;
      }
    });
  }
}
