import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LineaService } from '../../../core/services/linea.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerLineaResponse } from '../../../core/models/linea.models';

@Component({
  selector: 'app-lista-lineas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-lineas.component.html'
})
export class ListaLineasComponent implements OnInit {
  lineas: ObtenerLineaResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private service: LineaService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('lineas.crear');
    this.puedeEditar = this.auth.tienePermiso('lineas.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service.obtenerTodos().subscribe({
      next: (data) => { this.lineas = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar líneas.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    if (!confirm(`¿Desea ${estadoActual ? 'desactivar' : 'activar'} esta línea?`)) return;
    this.service.cambiarEstado(id, !estadoActual).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
