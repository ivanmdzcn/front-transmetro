import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccesoService } from '../../../core/services/acceso.service';
import { GuardiaService } from '../../../core/services/guardia.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerGuardiasAccesoResponse } from '../../../core/models/acceso.models';
import { ObtenerGuardiaResponse } from '../../../core/models/guardia.models';

@Component({
  selector: 'app-guardias-acceso',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './guardias-acceso.component.html'
})
export class GuardiasAccesoComponent implements OnInit {
  idAcceso = 0;
  descripcionAcceso = '';
  guardias: ObtenerGuardiasAccesoResponse[] = [];
  todosLosGuardias: ObtenerGuardiaResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeEditar = false;
  mostrarForm = false;
  idGuardiaSeleccionado: number | null = null;

  constructor(
    private accesoService: AccesoService,
    private guardiaService: GuardiaService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.puedeEditar = this.auth.tienePermiso('guardias.editar');
    this.idAcceso = Number(this.route.snapshot.paramMap.get('id'));
    this.accesoService.obtenerPorId(this.idAcceso).subscribe({
      next: (a) => this.descripcionAcceso = `${a.descripcion} — ${a.nombreEstacion}`
    });
    this.guardiaService.obtenerTodos().subscribe({
      next: (d) => this.todosLosGuardias = d.filter(g => g.activo)
    });
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.accesoService.obtenerGuardias(this.idAcceso).subscribe({
      next: (d) => { this.guardias = d; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar guardias.'; this.loading = false; }
    });
  }

  asignar(): void {
    if (!this.idGuardiaSeleccionado) return;
    this.accesoService.asignarGuardia(this.idAcceso, this.idGuardiaSeleccionado).subscribe({
      next: () => {
        this.mostrarForm = false;
        this.idGuardiaSeleccionado = null;
        this.cargar();
      },
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al asignar.'; }
    });
  }

  quitar(idGuardia: number): void {
    if (!confirm('¿Quitar este guardia del acceso?')) return;
    this.accesoService.quitarGuardia(this.idAcceso, idGuardia).subscribe({
      next: () => this.cargar(),
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al quitar el guardia.'; }
    });
  }

  get guardiasDisponibles(): ObtenerGuardiaResponse[] {
    const asignados = new Set(this.guardias.map(g => g.idGuardia));
    return this.todosLosGuardias.filter(g => !asignados.has(g.idGuardia));
  }
}
