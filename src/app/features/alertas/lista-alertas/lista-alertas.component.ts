import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertaService } from '../../../core/services/alerta.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerAlertaResponse } from '../../../core/models/alerta.models';

@Component({
  selector: 'app-lista-alertas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-alertas.component.html'
})
export class ListaAlertasComponent implements OnInit {
  alertas: ObtenerAlertaResponse[] = [];
  loading   = false;
  errorMsg  = '';
  puedeEditar = false;

  constructor(private alertaService: AlertaService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEditar = this.auth.tienePermiso('alertas.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.alertaService.obtenerActivas().subscribe({
      next: (data) => { this.alertas = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar alertas.'; this.loading = false; }
    });
  }

  resolver(idAlerta: number): void {
    if (!confirm('¿Marcar esta alerta como resuelta?')) return;
    this.alertaService.resolver(idAlerta).subscribe({
      next: () => this.cargar(),
      error: () => alert('Error al resolver la alerta.')
    });
  }

  tipoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'capacidad_excedida': return 'bg-danger';
      case 'bus_bajo_ocupacion': return 'bg-warning text-dark';
      default:                   return 'bg-secondary';
    }
  }
}
