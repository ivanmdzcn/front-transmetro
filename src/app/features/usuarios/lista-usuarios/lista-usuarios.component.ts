import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService }    from '../../../core/services/usuario.service';
import { AuthService }       from '../../../core/services/auth.service';
import { ObtenerTodosUsuariosResponse } from '../../../core/models/usuario.models';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss'
})
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  usuarios: ObtenerTodosUsuariosResponse[] = [];
  loading          = false;
  errorMsg         = '';
  puedeCrear       = false;
  puedeEditar      = false;
  puedeDesactivar  = false;
  puedeVerPermisos = false;
  private sub!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe(() => {
      this.puedeCrear       = this.auth.tienePermiso('usuarios.crear');
      this.puedeEditar      = this.auth.tienePermiso('usuarios.editar');
      this.puedeDesactivar  = this.auth.tienePermiso('usuarios.desactivar');
      this.puedeVerPermisos = this.auth.tienePermiso('permisos.ver');
    });
    this.cargarUsuarios();
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  cargarUsuarios(): void {
    this.loading  = true;
    this.errorMsg = '';
    this.usuarioService.obtenerTodos().subscribe({
      next: (data) => { this.usuarios = data; this.loading = false; },
      error: ()    => { this.errorMsg = 'Error al cargar usuarios.'; this.loading = false; }
    });
  }

  cambiarEstado(id: number, estadoActual: boolean): void {
    const nuevoEstado = !estadoActual;
    const accion      = nuevoEstado ? 'activar' : 'desactivar';
    if (!confirm(`¿Desea ${accion} este usuario?`)) return;
    this.usuarioService.cambiarEstado(id, nuevoEstado).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('Error al cambiar el estado del usuario.')
    });
  }

  // eliminar(id: number): void {
  //   if (!confirm('¿Desea eliminar (desactivar) este usuario?')) return;
  //   this.usuarioService.eliminar(id).subscribe({
  //     next: () => this.cargarUsuarios(),
  //     error: () => alert('Error al eliminar el usuario.')
  //   });
  // }
}
