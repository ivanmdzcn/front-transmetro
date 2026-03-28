import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  summaryCards = [
    { label: 'Usuarios activos',  value: '0', icon: 'bi-people-fill',     color: '#1a3c5e' },
    { label: 'Reportes hoy',      value: '0', icon: 'bi-file-earmark-bar-graph', color: '#2e86c1' },
    { label: 'Pendientes',        value: '0', icon: 'bi-hourglass-split',  color: '#f39c12' },
    { label: 'Completados',       value: '0', icon: 'bi-check-circle-fill', color: '#27ae60' },
  ];
}
