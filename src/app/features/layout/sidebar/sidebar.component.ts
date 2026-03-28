import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  label:    string;
  icon:     string;
  route:    string;
  permiso?: string;
}

export interface NavSection {
  label:    string;
  icon:     string;
  items:    NavItem[];
  open:     boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input()  isOpen = true;
  @Output() closeSidebar = new EventEmitter<void>();

  nombreUsuario = '';
  rol           = '';

  // Ítem independiente
  dashboardItem: NavItem = { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' };

  private allSections: NavSection[] = [
    {
      label: 'Seguridad',
      icon:  'bi-shield-lock',
      open:  false,
      items: [
        { label: 'Usuarios',      icon: 'bi-people',       route: '/usuarios',      permiso: 'usuarios.ver' },
        { label: 'Roles',         icon: 'bi-person-badge', route: '/roles',         permiso: 'roles.ver' },
        { label: 'Permisos',      icon: 'bi-key',          route: '/permisos',      permiso: 'permisos.ver' },
        { label: 'Configuración', icon: 'bi-sliders',      route: '/configuracion', permiso: 'configuracion.ver' },
      ]
    },
    {
      label: 'Transmetro',
      icon:  'bi-bus-front',
      open:  false,
      items: [
        { label: 'Municipalidades', icon: 'bi-building',             route: '/municipalidades', permiso: 'municipalidades.ver' },
        { label: 'Estaciones',      icon: 'bi-geo-alt',              route: '/estaciones',      permiso: 'estaciones.ver' },
        { label: 'Parqueos',        icon: 'bi-p-square',             route: '/parqueos',        permiso: 'parqueos.ver' },
        { label: 'Accesos',         icon: 'bi-door-open',            route: '/accesos',         permiso: 'accesos.ver' },
        { label: 'Líneas',          icon: 'bi-diagram-3',            route: '/lineas',          permiso: 'lineas.ver' },
        { label: 'Buses',           icon: 'bi-bus-front',            route: '/buses',           permiso: 'buses.ver' },
        { label: 'Pilotos',         icon: 'bi-person-badge',         route: '/pilotos',         permiso: 'pilotos.ver' },
        { label: 'Guardias',        icon: 'bi-shield-check',         route: '/guardias',        permiso: 'guardias.ver' },
        { label: 'Operadores',      icon: 'bi-headset',              route: '/operadores',      permiso: 'operadores.ver' },
        { label: 'Recorridos',      icon: 'bi-map',                  route: '/recorridos',      permiso: 'recorridos.ver' },
        { label: 'Alertas',         icon: 'bi-exclamation-triangle', route: '/alertas',         permiso: 'alertas.ver' },
        { label: 'Reportes',        icon: 'bi-bar-chart-line',       route: '/reportes',        permiso: 'reportes.ver' },
      ]
    }
  ];

  sections: NavSection[] = [];
  private sub!: Subscription;

  constructor(private auth: AuthService) {}

  toggleSection(section: NavSection): void {
    const wasOpen = section.open;
    this.sections.forEach(s => s.open = false);
    section.open = !wasOpen;
  }

  handleNavClick(): void {
    if (window.innerWidth < 992) {
      this.closeSidebar.emit();
    }
  }

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe(user => {
      this.nombreUsuario = user?.nombre ?? this.auth.getNombreUsuario();
      this.rol           = user?.rol    ?? this.auth.getRol() ?? 'Sin rol';
      this.sections = this.allSections
        .map(sec => ({
          ...sec,
          items: sec.items.filter(item => !item.permiso || this.auth.tienePermiso(item.permiso))
        }))
        .filter(sec => sec.items.length > 0);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
