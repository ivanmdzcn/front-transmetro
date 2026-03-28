import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstacionService } from '../../../core/services/estacion.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerEstacionResponse } from '../../../core/models/estacion.models';

@Component({
  selector: 'app-lista-estaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-estaciones.component.html'
})
export class ListaEstacionesComponent implements OnInit {
  estaciones: ObtenerEstacionResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private service: EstacionService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('estaciones.crear');
    this.puedeEditar = this.auth.tienePermiso('estaciones.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service.obtenerTodos().subscribe({
      next: (data) => { this.estaciones = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar estaciones.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    if (!confirm(`¿Desea ${estadoActual ? 'desactivar' : 'activar'} esta estación?`)) return;
    this.service.cambiarEstado(id, !estadoActual).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
