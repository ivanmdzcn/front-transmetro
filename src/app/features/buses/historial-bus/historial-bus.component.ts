import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BusService } from '../../../core/services/bus.service';
import { BusParqueoHistorialResponse } from '../../../core/models/bus.models';

@Component({
  selector: 'app-historial-bus',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial-bus.component.html'
})
export class HistorialBusComponent implements OnInit {
  idBus = 0;
  historial: BusParqueoHistorialResponse[] = [];
  loading  = false;
  errorMsg = '';

  constructor(private busService: BusService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idBus = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.busService.obtenerHistorialParqueos(this.idBus).subscribe({
      next: (data) => { this.historial = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar historial.'; this.loading = false; }
    });
  }
}
