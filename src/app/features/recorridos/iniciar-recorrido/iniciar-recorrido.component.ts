import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RecorridoService } from '../../../core/services/recorrido.service';
import { BusService } from '../../../core/services/bus.service';
import { LineaService } from '../../../core/services/linea.service';
import { PilotoService } from '../../../core/services/piloto.service';
import { OperadorService } from '../../../core/services/operador.service';
import { ObtenerBusResponse } from '../../../core/models/bus.models';
import { ObtenerLineaResponse, LineaEstacionResponse } from '../../../core/models/linea.models';
import { ObtenerPilotoResponse } from '../../../core/models/piloto.models';
import { ObtenerOperadorResponse } from '../../../core/models/operador.models';
import { IniciarRecorridoResponse } from '../../../core/models/recorrido.models';

@Component({
  selector: 'app-iniciar-recorrido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './iniciar-recorrido.component.html'
})
export class IniciarRecorridoComponent implements OnInit {
  form: FormGroup;
  errorMsg = '';
  loading = false;
  resultado: IniciarRecorridoResponse | null = null;
  buses: ObtenerBusResponse[] = [];
  lineas: ObtenerLineaResponse[] = [];
  pilotos: ObtenerPilotoResponse[] = [];
  operadores: ObtenerOperadorResponse[] = [];
  estacionesLinea: LineaEstacionResponse[] = [];
  loadingEstaciones = false;

  get estacionOrigen() { return this.estacionesLinea.at(0); }
  get estacionDestino() { return this.estacionesLinea.at(-1); }
  get paradasIntermedias() { return this.estacionesLinea.slice(1, -1); }

  constructor(
    private fb: FormBuilder,
    private recorridoService: RecorridoService,
    private busService: BusService,
    private lineaService: LineaService,
    private pilotoService: PilotoService,
    private operadorService: OperadorService,
    private router: Router
  ) {
    this.form = this.fb.group({
      idBus:      [null, Validators.required],
      idLinea:    [null, Validators.required],
      idPiloto:   [null, Validators.required],
      idOperador: [null]
    });
  }

  ngOnInit(): void {
    this.busService.obtenerTodos().subscribe({ next: (d) => this.buses = d.filter(b => b.activo && b.estado === 'activo') });
    this.lineaService.obtenerTodos().subscribe({ next: (d) => this.lineas = d.filter(l => l.activo) });
    this.pilotoService.obtenerTodos().subscribe({ next: (d) => this.pilotos = d.filter(p => p.activo) });
    this.operadorService.obtenerActivos().subscribe({ next: (d) => this.operadores = d });

    this.form.get('idLinea')!.valueChanges.subscribe(idLinea => {
      this.estacionesLinea = [];
      if (!idLinea) return;
      this.loadingEstaciones = true;
      this.lineaService.obtenerEstaciones(idLinea).subscribe({
        next: (est) => {
          this.estacionesLinea = est.filter(e => e.activo).sort((a, b) => a.orden - b.orden);
          this.loadingEstaciones = false;
        },
        error: () => { this.loadingEstaciones = false; }
      });
    });
  }

  iniciar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.estacionesLinea.length === 0) {
      this.errorMsg = 'La línea seleccionada no tiene estaciones asignadas.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.recorridoService.iniciar(this.form.value).subscribe({
      next: (res) => { this.resultado = res; this.loading = false; },
      error: (err) => { this.errorMsg = err?.error?.mensaje ?? 'Error al iniciar recorrido.'; this.loading = false; }
    });
  }

  irAParadas(): void {
    this.router.navigate(['/recorridos/paradas', this.resultado!.idRecorrido]);
  }

  get f() { return this.form.controls; }
}
