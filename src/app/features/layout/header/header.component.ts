import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserSession } from '../../../core/models/auth.models';
import { ConfiguracionEmpresaService } from '../../../core/services/configuracion-empresa.service';
import { AlertaService } from '../../../core/services/alerta.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser$!: Observable<UserSession | null>;
  nombreEmpresa = 'LM Corp';
  alertasActivas = 0;

  private alertaSub?: Subscription;

  constructor(
    private auth: AuthService,
    private configSvc: ConfiguracionEmpresaService,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.auth.currentUser$;
    this.configSvc.obtener().subscribe({
      next: (cfg) => {
        if (cfg.nombreComercial || cfg.razonSocial) {
          this.nombreEmpresa = cfg.nombreComercial ?? cfg.razonSocial;
        }
      }
    });
    this.cargarAlertas();
    this.alertaSub = interval(60000).subscribe(() => this.cargarAlertas());
  }

  ngOnDestroy(): void {
    this.alertaSub?.unsubscribe();
  }

  private cargarAlertas(): void {
    this.alertaService.obtenerActivas().subscribe({
      next: (lista) => { this.alertasActivas = lista.length; },
      error: () => { this.alertasActivas = 0; }
    });
  }

  onToggle(): void { this.toggleSidebar.emit(); }

  onLogout(): void {
    if (confirm('¿Desea cerrar sesión?')) {
      this.auth.logout();
    }
  }
}
