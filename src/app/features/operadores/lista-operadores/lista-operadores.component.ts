import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OperadorService } from '../../../core/services/operador.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerOperadorResponse } from '../../../core/models/operador.models';

@Component({
  selector: 'app-lista-operadores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-operadores.component.html'
})
export class ListaOperadoresComponent implements OnInit {
  operadores: ObtenerOperadorResponse[] = [];
  loading   = false;
  errorMsg  = '';
  puedeCrear  = false;
  puedeEditar = false;

  constructor(private operadorService: OperadorService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('operadores.crear');
    this.puedeEditar = this.auth.tienePermiso('operadores.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.operadorService.obtenerTodos().subscribe({
      next: (data) => { this.operadores = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar operadores.'; this.loading = false; }
    });
  }

  cambiarEstado(o: ObtenerOperadorResponse): void {
    if (!confirm(`¿${o.activo ? 'Desactivar' : 'Activar'} al operador ${o.nombre} ${o.apellido}?`)) return;
    this.operadorService.cambiarEstado(o.idOperador, !o.activo).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al cambiar el estado.')
    });
  }
}
