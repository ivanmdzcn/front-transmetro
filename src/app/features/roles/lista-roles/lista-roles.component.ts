import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RolService }        from '../../../core/services/rol.service';
import { AuthService }       from '../../../core/services/auth.service';
import { ObtenerTodosRolesResponse } from '../../../core/models/rol.models';

@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-roles.component.html',
  styleUrl: './lista-roles.component.scss'
})
export class ListaRolesComponent implements OnInit, OnDestroy {
  roles: ObtenerTodosRolesResponse[] = [];
  loading          = false;
  errorMsg         = '';
  puedeCrear       = false;
  puedeEditar      = false;
  puedeDesactivar  = false;
  puedeVerPermisos = false;
  private sub!: Subscription;

  constructor(
    private rolService: RolService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe(() => {
      this.puedeCrear       = this.auth.tienePermiso('roles.crear');
      this.puedeEditar      = this.auth.tienePermiso('roles.editar');
      this.puedeDesactivar  = this.auth.tienePermiso('roles.desactivar');
      this.puedeVerPermisos = this.auth.tienePermiso('permisos.ver');
    });
    this.cargarRoles();
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  cargarRoles(): void {
    this.loading  = true;
    this.errorMsg = '';
    this.rolService.obtenerTodos().subscribe({
      next: (data) => { this.roles = data; this.loading = false; },
      error: ()    => { this.errorMsg = 'Error al cargar roles.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    const nuevoEstado = !estadoActual;
    const accion      = nuevoEstado ? 'activar' : 'desactivar';
    if (!confirm(`¿Desea ${accion} este rol?`)) return;
    this.rolService.cambiarEstado(id, nuevoEstado).subscribe({
      next: () => this.cargarRoles(),
      error: (err) => alert(err.error?.mensaje || 'Error al cambiar el estado del rol.')
    });
  }
}
