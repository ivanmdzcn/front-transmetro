import { Component, OnInit }             from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute }        from '@angular/router';
import { CommonModule }                  from '@angular/common';
import { AuthService }                   from '../../../core/services/auth.service';
import { LoginRequest }                  from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!:  FormGroup;
  loading      = false;
  errorMsg     = '';
  showPass     = false;
  currentYear  = new Date().getFullYear();
  private returnUrl = '/dashboard';

  constructor(
    private fb:    FormBuilder,
    private auth:  AuthService,
    private router: Router,
    private route:  ActivatedRoute
  ) {
    // Inicializar el form en el constructor para que el template nunca lo reciba undefined
    this.loginForm = this.fb.group({
      identificador: ['', [Validators.required]],
      contrasena:    ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    // Si ya tiene sesión activa, redirigir antes de que se muestre el login
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/dashboard';
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading  = true;
    this.errorMsg = '';
    const credentials: LoginRequest = this.loginForm.value;
    this.auth.login(credentials).subscribe({
      next:  () => this.router.navigate([this.returnUrl]),
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMsg = err.error?.mensaje ?? 'Credenciales invalidas.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor.';
        } else {
          this.errorMsg = 'Error inesperado. Intente nuevamente.';
        }
      }
    });
  }
}
