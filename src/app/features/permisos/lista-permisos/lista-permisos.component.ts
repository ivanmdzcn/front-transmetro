import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterModule }             from '@angular/router';
import { CommonModule } from '@angular/common';
import { PermisoService }     from '../../../core/services/permiso.service';
import { PermisoDisponible }  from '../../../core/models/rol-permiso.models';
import { AuthService }        from '../../../core/services/auth.service';

@Component({
  selector: 'app-lista-permisos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-permisos.component.html',
  styleUrl: './lista-permisos.component.scss'
})
export class ListaPermisosComponent implements OnInit, OnDestroy {
  permisos:    PermisoDisponible[] = [];
  loading       = false;
  errorMsg      = '';
  puedeCrear    = false;
  puedeEditar   = false;
  puedeEliminar = false;
  private sub!: Subscription;

  constructor(
    private permisoService: PermisoService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe(() => {
      this.puedeCrear    = this.auth.tienePermiso('permisos.crear');
      this.puedeEditar   = this.auth.tienePermiso('permisos.editar');
      this.puedeEliminar = this.auth.tienePermiso('permisos.eliminar');
    });
    this.cargarPermisos();
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  cargarPermisos(): void {
    this.loading  = true;
    this.errorMsg = '';
    this.permisoService.obtenerTodos().subscribe({
      next:  (data) => { this.permisos = data; this.loading = false; },
      error: ()     => { this.errorMsg = 'Error al cargar permisos.'; this.loading = false; }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/permisos/editar', id]);
  }

  eliminar(id: number): void {
    if (!confirm('\u00bfEliminar este permiso? Esta acci\u00f3n puede afectar roles y usuarios.')) return;
    this.permisoService.eliminar(id).subscribe({
      next:  () => this.cargarPermisos(),
      error: () => alert('Error al eliminar el permiso.')
    });
  }
}
