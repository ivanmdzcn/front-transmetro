import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecorridoService } from '../../../core/services/recorrido.service';
import { ObtenerRecorridoResponse } from '../../../core/models/recorrido.models';

@Component({
  selector: 'app-historial-recorridos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial-recorridos.component.html'
})
export class HistorialRecorridosComponent implements OnInit {
  recorridos: ObtenerRecorridoResponse[] = [];
  loading   = false;
  errorMsg  = '';

  constructor(private recorridoService: RecorridoService) {}

  ngOnInit(): void {
    this.loading = true;
    this.recorridoService.obtenerTodos().subscribe({
      next: (data) => { this.recorridos = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar historial.'; this.loading = false; }
    });
  }
}
