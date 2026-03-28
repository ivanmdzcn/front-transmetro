import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MunicipalidadService } from '../../../core/services/municipalidad.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerMunicipalidadResponse } from '../../../core/models/municipalidad.models';

@Component({
  selector: 'app-lista-municipalidades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-municipalidades.component.html'
})
export class ListaMunicipalidadesComponent implements OnInit {
  municipalidades: ObtenerMunicipalidadResponse[] = [];
  loading   = false;
  errorMsg  = '';
  puedeCrear   = false;
  puedeEditar  = false;
  puedeCambiarEstado = false;

  constructor(
    private municipalidadService: MunicipalidadService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.puedeCrear        = this.auth.tienePermiso('municipalidades.crear');
    this.puedeEditar       = this.auth.tienePermiso('municipalidades.editar');
    this.puedeCambiarEstado = this.auth.tienePermiso('municipalidades.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading  = true;
    this.errorMsg = '';
    this.municipalidadService.obtenerTodos().subscribe({
      next: (data) => { this.municipalidades = data; this.loading = false; },
      error: ()    => { this.errorMsg = 'Error al cargar municipalidades.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    if (!confirm(`¿Desea ${estadoActual ? 'desactivar' : 'activar'} esta municipalidad?`)) return;
    this.municipalidadService.cambiarEstado(id, !estadoActual).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
