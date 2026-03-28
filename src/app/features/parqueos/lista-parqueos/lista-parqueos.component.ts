import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParqueoService } from '../../../core/services/parqueo.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerParqueoResponse } from '../../../core/models/parqueo.models';

@Component({
  selector: 'app-lista-parqueos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-parqueos.component.html'
})
export class ListaParqueosComponent implements OnInit {
  parqueos: ObtenerParqueoResponse[] = [];
  loading  = false;
  errorMsg = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private service: ParqueoService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('parqueos.crear');
    this.puedeEditar = this.auth.tienePermiso('parqueos.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service.obtenerTodos().subscribe({
      next: (data) => { this.parqueos = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar parqueos.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    if (!confirm(`¿Desea ${estadoActual ? 'desactivar' : 'activar'} este parqueo?`)) return;
    this.service.cambiarEstado(id, !estadoActual).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
