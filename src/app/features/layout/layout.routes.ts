import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard',     loadChildren: () => import('../dashboard/dashboard.routes').then(m => m.dashboardRoutes) },
      { path: 'perfil',        loadChildren: () => import('../perfil/perfil.routes').then(m => m.perfilRoutes) },
      { path: 'usuarios',      loadChildren: () => import('../usuarios/usuarios.routes').then(m => m.usuariosRoutes) },
      { path: 'roles',         loadChildren: () => import('../roles/roles.routes').then(m => m.rolesRoutes) },
      { path: 'permisos',      loadChildren: () => import('../permisos/permisos.routes').then(m => m.permisosRoutes) },
      { path: 'configuracion', loadChildren: () => import('../configuracion-empresa/configuracion-empresa.routes').then(m => m.configuracionRoutes) },
      { path: 'municipalidades', loadChildren: () => import('../municipalidades/municipalidades.routes').then(m => m.municipalidadesRoutes) },
      { path: 'estaciones',      loadChildren: () => import('../estaciones/estaciones.routes').then(m => m.estacionesRoutes) },
      { path: 'parqueos',        loadChildren: () => import('../parqueos/parqueos.routes').then(m => m.parqueosRoutes) },
      { path: 'accesos',         loadChildren: () => import('../accesos/accesos.routes').then(m => m.accesosRoutes) },
      { path: 'lineas',          loadChildren: () => import('../lineas/lineas.routes').then(m => m.lineasRoutes) },
      { path: 'buses',           loadChildren: () => import('../buses/buses.routes').then(m => m.BUSES_ROUTES) },
      { path: 'pilotos',         loadChildren: () => import('../pilotos/pilotos.routes').then(m => m.PILOTOS_ROUTES) },
      { path: 'guardias',        loadChildren: () => import('../guardias/guardias.routes').then(m => m.GUARDIAS_ROUTES) },
      { path: 'operadores',      loadChildren: () => import('../operadores/operadores.routes').then(m => m.OPERADORES_ROUTES) },
      { path: 'recorridos',      loadChildren: () => import('../recorridos/recorridos.routes').then(m => m.RECORRIDOS_ROUTES) },
      { path: 'alertas',         loadChildren: () => import('../alertas/alertas.routes').then(m => m.ALERTAS_ROUTES) },
      { path: 'reportes',        loadChildren: () => import('../reportes/reportes.routes').then(m => m.REPORTES_ROUTES) },
      { path: '',                redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
