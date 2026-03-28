import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GuardiaService } from '../../../core/services/guardia.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerGuardiaResponse } from '../../../core/models/guardia.models';

@Component({
  selector: 'app-lista-guardias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-guardias.component.html'
})
export class ListaGuardiasComponent implements OnInit {
  guardias: ObtenerGuardiaResponse[] = [];
  loading   = false;
  errorMsg  = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private guardiaService: GuardiaService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('guardias.crear');
    this.puedeEditar = this.auth.tienePermiso('guardias.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.guardiaService.obtenerTodos().subscribe({
      next: (data) => { this.guardias = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar guardias.'; this.loading = false; }
    });
  }

  cambiarEstado(g: ObtenerGuardiaResponse): void {
    if (!confirm(`¿${g.activo ? 'Desactivar' : 'Activar'} al guardia ${g.nombre} ${g.apellido}?`)) return;
    this.guardiaService.cambiarEstado(g.idGuardia, !g.activo).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
