import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GuardiaService } from '../../../core/services/guardia.service';
import { AccesoService } from '../../../core/services/acceso.service';
import { AuthService } from '../../../core/services/auth.service';
import { GuardiaAccesoResponse } from '../../../core/models/guardia.models';
import { ObtenerAccesoResponse } from '../../../core/models/acceso.models';

@Component({
  selector: 'app-accesos-guardia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './accesos-guardia.component.html'
})
export class AccesosGuardiaComponent implements OnInit {
  idGuardia = 0;
  nombreGuardia = '';
  accesosGuardia: GuardiaAccesoResponse[] = [];
  accesosDisponibles: ObtenerAccesoResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeEditar = false;
  mostrarForm = false;

  asignarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private guardiaService: GuardiaService,
    private accesoService: AccesoService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.asignarForm = this.fb.group({
      idAcceso: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.puedeEditar = this.auth.tienePermiso('guardias.editar');
    this.idGuardia = Number(this.route.snapshot.paramMap.get('id'));
    this.guardiaService.obtenerPorId(this.idGuardia).subscribe({
      next: (g) => this.nombreGuardia = `${g.nombre} ${g.apellido}`
    });
    this.accesoService.obtenerTodos().subscribe({
      next: (d) => this.accesosDisponibles = d.filter(a => a.activo)
    });
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.guardiaService.obtenerAccesos(this.idGuardia).subscribe({
      next: (d) => { this.accesosGuardia = d; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar accesos.'; this.loading = false; }
    });
  }

  asignar(): void {
    if (this.asignarForm.invalid) { this.asignarForm.markAllAsTouched(); return; }
    this.guardiaService.asignarAcceso(this.idGuardia, this.asignarForm.value).subscribe({
      next: () => { this.mostrarForm = false; this.asignarForm.reset(); this.cargar(); },
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al asignar.'; }
    });
  }

  quitar(idAcceso: number): void {
    if (!confirm('¿Quitar este acceso del guardia?')) return;
    this.guardiaService.quitarAcceso(this.idGuardia, idAcceso).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.errorMsg = err?.error?.mensaje
          ?? err?.error?.title
          ?? 'Error al quitar el acceso.';
      }
    });
  }

  /** El guardia ya tiene un acceso activo asignado */
  get tieneAccesoActivo(): boolean {
    return this.accesosGuardia.some(a => a.activo);
  }

  /** Accesos que aún no están asignados a este guardia */
  get accesosSinAsignar(): ObtenerAccesoResponse[] {
    const asignados = new Set(this.accesosGuardia.map(a => a.idAcceso));
    return this.accesosDisponibles.filter(a => !asignados.has(a.idAcceso));
  }

  get f() { return this.asignarForm.controls; }
}
