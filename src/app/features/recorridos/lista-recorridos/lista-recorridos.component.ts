import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecorridoService } from '../../../core/services/recorrido.service';
import { AuthService } from '../../../core/services/auth.service';
import { ObtenerRecorridoResponse, RecorridoParadaResponse } from '../../../core/models/recorrido.models';

@Component({
  selector: 'app-lista-recorridos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-recorridos.component.html'
})
export class ListaRecorridosComponent implements OnInit {
  recorridos: ObtenerRecorridoResponse[] = [];
  loading   = false;
  errorMsg  = '';
  puedeCrear  = false;
  puedeEditar = false;

  llegadaRecorridoId: number | null = null;
  loadingLlegada = false;
  errorLlegada = '';
  paradasLlegada: RecorridoParadaResponse[] = [];
  loadingParadas = false;

  get todasParadasCompletadas(): boolean {
    return this.paradasLlegada.length > 0 &&
           this.paradasLlegada.every(p => p.estado === 'completado');
  }

  constructor(
    private recorridoService: RecorridoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.puedeCrear  = this.auth.tienePermiso('recorridos.crear');
    this.puedeEditar = this.auth.tienePermiso('recorridos.editar');
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.recorridoService.obtenerActivos().subscribe({
      next: (data) => { this.recorridos = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar recorridos.'; this.loading = false; }
    });
  }

  abrirLlegada(idRecorrido: number): void {
    this.llegadaRecorridoId = idRecorrido;
    this.errorLlegada = '';
    this.paradasLlegada = [];
    this.loadingParadas = true;
    this.recorridoService.obtenerParadas(idRecorrido).subscribe({
      next: (data) => { this.paradasLlegada = data; this.loadingParadas = false; },
      error: () => { this.loadingParadas = false; }
    });
  }

  registrarLlegada(): void {
    if (!this.llegadaRecorridoId || !this.todasParadasCompletadas) return;
    this.loadingLlegada = true;
    this.recorridoService.registrarLlegada(this.llegadaRecorridoId, {}).subscribe({
      next: () => { this.llegadaRecorridoId = null; this.loadingLlegada = false; this.cargar(); },
      error: (err) => { this.errorLlegada = err?.error?.mensaje ?? 'Error al registrar.'; this.loadingLlegada = false; }
    });
  }
}
