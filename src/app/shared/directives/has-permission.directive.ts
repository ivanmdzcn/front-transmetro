import {
  Directive, Input,
  TemplateRef, ViewContainerRef, OnInit
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

/**
 * Directiva estructural que muestra el elemento solo si el usuario
 * tiene al menos uno de los permisos indicados.
 *
 * Uso:
 *   <button *appHasPermission="'usuarios.crear'">Crear</button>
 *   <li *appHasPermission="['roles.ver', 'roles.editar']">Roles</li>
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {

  private permisos: string[] = [];

  constructor(
    private tpl:  TemplateRef<unknown>,
    private vcr:  ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input()
  set appHasPermission(value: string | string[]) {
    this.permisos = Array.isArray(value) ? value : [value];
  }

  ngOnInit(): void {
    if (this.auth.tieneAlgunPermiso(this.permisos)) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
