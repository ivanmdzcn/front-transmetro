import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PilotoService } from '../../../core/services/piloto.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerPilotoResponse } from '../../../core/models/piloto.models';

@Component({
  selector: 'app-lista-pilotos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-pilotos.component.html'
})
export class ListaPilotosComponent implements OnInit {
  pilotos: ObtenerPilotoResponse[] = [];
  loading   = false;
  errorMsg  = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private pilotoService: PilotoService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('pilotos.crear');
    this.puedeEditar = this.auth.tienePermiso('pilotos.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.pilotoService.obtenerTodos().subscribe({
      next: (data) => { this.pilotos = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar pilotos.'; this.loading = false; }
    });
  }

  cambiarEstado(p: ObtenerPilotoResponse): void {
    if (!confirm(`¿${p.activo ? 'Desactivar' : 'Activar'} al piloto ${p.nombre} ${p.apellido}?`)) return;
    this.pilotoService.cambiarEstado(p.idPiloto, !p.activo).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
