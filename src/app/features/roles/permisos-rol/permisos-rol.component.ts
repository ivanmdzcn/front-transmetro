import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { forkJoin }          from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RolService }         from '../../../core/services/rol.service';
import { RolPermisoService }  from '../../../core/services/rol-permiso.service';
import { PermisoService }     from '../../../core/services/permiso.service';
import { AuthService }        from '../../../core/services/auth.service';
import { PermisoConAsignacion } from '../../../core/models/rol-permiso.models';

@Component({
  selector: 'app-permisos-rol',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './permisos-rol.component.html',
  styleUrl: './permisos-rol.component.scss'
})
export class PermisosRolComponent implements OnInit {
  rolId     = 0;
  nombreRol = '';
  loading   = false;
  errorMsg  = '';
  puedeAsignar = false;
  puedeRevocar = false;

  permisos:  PermisoConAsignacion[]                   = [];
  agrupados: Record<string, PermisoConAsignacion[]>   = {};

  constructor(
    private route:    ActivatedRoute,
    private rolService: RolService,
    private rpService:  RolPermisoService,
    private pService:   PermisoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.rolId = Number(this.route.snapshot.paramMap.get('id'));
    this.auth.currentUser$.subscribe(() => {
      this.puedeAsignar = this.auth.tienePermiso('permisos.asignar');
      this.puedeRevocar = this.auth.tienePermiso('permisos.revocar');
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading  = true;
    this.errorMsg = '';

    forkJoin({
      rol:          this.rolService.obtenerPorId(this.rolId),
      disponibles:  this.pService.obtenerTodos(),
      asignados:    this.rpService.obtenerPermisos(this.rolId)
    }).subscribe({
      next: ({ rol, disponibles, asignados }) => {
        this.nombreRol = rol.nombre;
        const asignadosSet = new Set(asignados.map(a => a.permisoId));

        this.permisos = disponibles.map(p => ({ ...p, asignado: asignadosSet.has(p.id) }));

        this.agrupados = this.permisos.reduce((acc, p) => {
          (acc[p.modulo] ??= []).push(p);
          return acc;
        }, {} as Record<string, PermisoConAsignacion[]>);

        this.loading = false;
      },
      error: () => { this.errorMsg = 'Error al cargar datos del rol.'; this.loading = false; }
    });
  }

  modulos(): string[] { return Object.keys(this.agrupados); }

  get totalAsignados(): number { return this.permisos.filter(p => p.asignado).length; }

  asignados(modulo: string):  number { return this.agrupados[modulo].filter(p => p.asignado).length; }
  total(modulo: string):      number { return this.agrupados[modulo].length; }

  toggle(permiso: PermisoConAsignacion): void {
    permiso.asignado ? this.quitar(permiso) : this.asignar(permiso);
  }

  asignar(permiso: PermisoConAsignacion): void {
    this.rpService.asignarPermiso(this.rolId, permiso.id).subscribe({
      next: () => permiso.asignado = true,
      error: (err) => alert(err.error?.mensaje || 'Error al asignar permiso.')
    });
  }

  quitar(permiso: PermisoConAsignacion): void {
    this.rpService.quitarPermiso(this.rolId, permiso.id).subscribe({
      next: () => permiso.asignado = false,
      error: (err) => alert(err.error?.mensaje || 'Error al quitar permiso.')
    });
  }

  asignarModulo(modulo: string): void {
    if (!confirm(`¿Asignar todos los permisos del módulo ${modulo}?`)) return;
    const ids = this.agrupados[modulo].filter(p => !p.asignado).map(p => p.id);
    if (!ids.length) return;
    this.rpService.asignarVariosPermisos(this.rolId, ids).subscribe({
      next: () => this.agrupados[modulo].forEach(p => p.asignado = true),
      error: (err) => alert(err.error?.mensaje || 'Error al asignar permisos.')
    });
  }

  quitarModulo(modulo: string): void {
    if (!confirm(`¿Quitar todos los permisos del módulo ${modulo}?`)) return;
    const ids = this.agrupados[modulo].filter(p => p.asignado).map(p => p.id);
    if (!ids.length) return;
    this.rpService.quitarVariosPermisos(this.rolId, ids).subscribe({
      next: () => this.agrupados[modulo].forEach(p => p.asignado = false),
      error: (err) => alert(err.error?.mensaje || 'Error al quitar permisos.')
    });
  }
}
