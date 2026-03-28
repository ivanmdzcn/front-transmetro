import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable }  from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserSession } from '../../../core/models/auth.models';
import { ConfiguracionEmpresaService } from '../../../core/services/configuracion-empresa.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser$!: Observable<UserSession | null>;
  nombreEmpresa = 'LM Corp';

  constructor(
    private auth: AuthService,
    private configSvc: ConfiguracionEmpresaService
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
  }

  onToggle(): void { this.toggleSidebar.emit(); }

  onLogout(): void {
    if (confirm('¿Desea cerrar sesión?')) {
      this.auth.logout();
    }
  }
}
