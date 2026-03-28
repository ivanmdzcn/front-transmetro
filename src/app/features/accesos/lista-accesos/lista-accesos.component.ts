import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccesoService } from '../../../core/services/acceso.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerAccesoResponse } from '../../../core/models/acceso.models';

@Component({
  selector: 'app-lista-accesos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-accesos.component.html'
})
export class ListaAccesosComponent implements OnInit {
  accesos: ObtenerAccesoResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private service: AccesoService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('accesos.crear');
    this.puedeEditar = this.auth.tienePermiso('accesos.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service.obtenerTodos().subscribe({
      next: (data) => { this.accesos = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar accesos.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    if (!confirm(`¿Desea ${estadoActual ? 'desactivar' : 'activar'} este acceso?`)) return;
    this.service.cambiarEstado(id, !estadoActual).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
