import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { forkJoin }          from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService }         from '../../../core/services/usuario.service';
import { UsuarioPermisoService }  from '../../../core/services/usuario-permiso.service';
import { PermisoService }         from '../../../core/services/permiso.service';
import { AuthService }            from '../../../core/services/auth.service';
import { PermisoConEstado }       from '../../../core/models/usuario-permiso.models';

@Component({
  selector: 'app-permisos-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './permisos-usuario.component.html',
  styleUrl: './permisos-usuario.component.scss'
})
export class PermisosUsuarioComponent implements OnInit {
  usuarioId     = 0;
  nombreUsuario = '';
  loading       = false;
  errorMsg      = '';
  puedeAsignar  = false;
  puedeRevocar  = false;

  permisos: PermisoConEstado[]                           = [];
  agrupados: Record<string, PermisoConEstado[]>          = {};

  constructor(
    private route:          ActivatedRoute,
    private usuarioService: UsuarioService,
    private upService:      UsuarioPermisoService,
    private permisoService: PermisoService,
    private auth:           AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioId   = Number(this.route.snapshot.paramMap.get('id'));
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
      usuario:       this.usuarioService.obtenerPorId(this.usuarioId),
      todosPermisos: this.permisoService.obtenerTodos(),
      resueltos:     this.upService.obtenerPermisosResueltos(this.usuarioId),
      overrides:     this.upService.obtenerPermisos(this.usuarioId)
    }).subscribe({
      next: ({ usuario, todosPermisos, resueltos, overrides }) => {
        this.nombreUsuario = usuario.nombre;

        // Índice de permisos resueltos por id para O(1)
        const resueltosMap = new Map(resueltos.map(r => [r.id, r]));

        // Base = TODOS los permisos del sistema para poder asignar overrides
        // aunque el permiso no esté en el rol actual del usuario
        this.permisos = todosPermisos.map(p => {
          const resuelto = resueltosMap.get(p.id);
          const ov       = overrides.find(o => o.permisoId === p.id);
          return {
            id:                p.id,
            nombre:            p.nombre,
            modulo:            p.modulo,
            tieneOverride:     !!ov,
            overrideConcedido: ov?.concedido ?? false,
            permisoFinal:      resuelto?.tienePermiso ?? false
          };
        });

        this.agrupados = this.permisos.reduce((acc, p) => {
          (acc[p.modulo] ??= []).push(p);
          return acc;
        }, {} as Record<string, PermisoConEstado[]>);

        this.loading = false;
      },
      error: () => { this.errorMsg = 'Error al cargar datos del usuario.'; this.loading = false; }
    });
  }

  modulos(): string[] { return Object.keys(this.agrupados); }

  conceder(permisoId: number): void {
    if (!confirm('¿Conceder este permiso al usuario?')) return;
    this.upService.concederPermiso(this.usuarioId, permisoId).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => alert(err.error?.mensaje || 'Error al conceder permiso.')
    });
  }

  denegar(permisoId: number): void {
    if (!confirm('¿Denegar este permiso al usuario?')) return;
    this.upService.denegarPermiso(this.usuarioId, permisoId).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => alert(err.error?.mensaje || 'Error al denegar permiso.')
    });
  }

  quitarOverride(permisoId: number): void {
    if (!confirm('¿Eliminar override? El usuario heredará el permiso de su rol.')) return;
    this.upService.quitarPermiso(this.usuarioId, permisoId).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => alert(err.error?.mensaje || 'Error al quitar override.')
    });
  }
}
