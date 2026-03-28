import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService }                from '../../../core/services/auth.service';
import { ConfiguracionEmpresaService } from '../../../core/services/configuracion-empresa.service';

@Component({
  selector: 'app-form-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-configuracion.component.html',
  styleUrl: './form-configuracion.component.scss'
})
export class FormConfiguracionComponent implements OnInit, OnDestroy {

  form!:       FormGroup;
  loading      = false;
  guardando    = false;
  errorMsg     = '';
  successMsg   = '';
  puedeEditar  = false;
  activeTab    = 'basicos';

  private sub!: Subscription;

  constructor(
    private fb:     FormBuilder,
    private svc:    ConfiguracionEmpresaService,
    private auth:   AuthService
  ) {
    this.form = this.fb.group({
      // Datos básicos
      razonSocial:               ['', [Validators.required, Validators.maxLength(200)]],
      nombreComercial:           ['', Validators.maxLength(200)],
      numeroIdentificacionFiscal: ['', Validators.maxLength(50)],

      // Dirección
      direccion:    ['', Validators.required],
      ciudad:       ['', Validators.maxLength(100)],
      estadoProvincia: ['', Validators.maxLength(100)],
      codigoPostal:    ['', Validators.maxLength(20)],
      pais:         ['', [Validators.required, Validators.maxLength(100)]],

      // Contacto
      telefonoPrincipal:  ['', Validators.maxLength(20)],
      telefonoSecundario: ['', Validators.maxLength(20)],
      emailPrincipal:     ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      emailSecundario:    ['', [Validators.email, Validators.maxLength(100)]],
      sitioWeb:           ['', Validators.maxLength(200)],

      // Moneda
      codigoMoneda:      ['GTQ', [Validators.required, Validators.maxLength(3)]],
      simboloMoneda:     ['Q',   [Validators.required, Validators.maxLength(10)]],
      nombreMoneda:      ['Quetzal', Validators.maxLength(50)],
      posicionSimbolo:   ['antes', Validators.required],
      separadorMiles:    [',',  Validators.required],
      separadorDecimales: ['.', Validators.required],
      decimales:         [2, [Validators.required, Validators.min(0), Validators.max(4)]],

      // Logo y marca
      logoUrl:       ['', Validators.maxLength(500)],
      colorPrimario: ['#3B82F6'],

      // Documentos
      piePaginaDocumentos:   [''],
      mensajeAgradecimiento: ['']
    });
  }

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe(() => {
      this.puedeEditar = this.auth.tienePermiso('configuracion.editar');
      if (!this.puedeEditar) this.form.disable();
    });
    this.cargarDatos();
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  cargarDatos(): void {
    this.loading  = true;
    this.errorMsg = '';
    this.svc.obtener().subscribe({
      next: (data) => {
        this.form.patchValue({
          razonSocial:               data.razonSocial               ?? '',
          nombreComercial:           data.nombreComercial           ?? '',
          numeroIdentificacionFiscal: data.numeroIdentificacionFiscal ?? '',
          direccion:                 data.direccion                 ?? '',
          ciudad:                    data.ciudad                    ?? '',
          estadoProvincia:           data.estadoProvincia           ?? '',
          codigoPostal:              data.codigoPostal              ?? '',
          pais:                      data.pais                      ?? '',
          telefonoPrincipal:         data.telefonoPrincipal         ?? '',
          telefonoSecundario:        data.telefonoSecundario        ?? '',
          emailPrincipal:            data.emailPrincipal            ?? '',
          emailSecundario:           data.emailSecundario           ?? '',
          sitioWeb:                  data.sitioWeb                  ?? '',
          codigoMoneda:              data.codigoMoneda              ?? 'GTQ',
          simboloMoneda:             data.simboloMoneda             ?? 'Q',
          nombreMoneda:              data.nombreMoneda              ?? 'Quetzal',
          posicionSimbolo:           data.posicionSimbolo           ?? 'antes',
          separadorMiles:            data.separadorMiles            ?? ',',
          separadorDecimales:        data.separadorDecimales        ?? '.',
          decimales:                 data.decimales                 ?? 2,
          logoUrl:                   data.logoUrl                   ?? '',
          colorPrimario:             data.colorPrimario             ?? '#3B82F6',
          piePaginaDocumentos:       data.piePaginaDocumentos       ?? '',
          mensajeAgradecimiento:     data.mensajeAgradecimiento     ?? ''
        });
        this.loading = false;
      },
      error: (err) => {
        // 404 significa que no se ha configurado aún — el form queda vacío listo para crear
        if (err.status !== 404) {
          this.errorMsg = 'Error al cargar la configuración.';
        }
        this.loading = false;
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.activeTab = this.getFirstInvalidTab();
      return;
    }
    this.guardando  = true;
    this.errorMsg   = '';
    this.successMsg = '';

    const v = this.form.value;
    const req = {
      razonSocial:               v.razonSocial,
      nombreComercial:           v.nombreComercial           || null,
      numeroIdentificacionFiscal: v.numeroIdentificacionFiscal || null,
      direccion:                 v.direccion,
      ciudad:                    v.ciudad                    || null,
      estadoProvincia:           v.estadoProvincia           || null,
      codigoPostal:              v.codigoPostal              || null,
      pais:                      v.pais,
      telefonoPrincipal:         v.telefonoPrincipal         || null,
      telefonoSecundario:        v.telefonoSecundario        || null,
      emailPrincipal:            v.emailPrincipal,
      emailSecundario:           v.emailSecundario           || null,
      sitioWeb:                  v.sitioWeb                  || null,
      codigoMoneda:              v.codigoMoneda,
      simboloMoneda:             v.simboloMoneda,
      nombreMoneda:              v.nombreMoneda              || null,
      posicionSimbolo:           v.posicionSimbolo,
      separadorMiles:            v.separadorMiles,
      separadorDecimales:        v.separadorDecimales,
      decimales:                 v.decimales,
      logoUrl:                   v.logoUrl                   || null,
      colorPrimario:             v.colorPrimario             || null,
      piePaginaDocumentos:       v.piePaginaDocumentos       || null,
      mensajeAgradecimiento:     v.mensajeAgradecimiento     || null
    };

    this.svc.actualizar(req).subscribe({
      next:  () => {
        this.successMsg = 'Configuración guardada correctamente.';
        this.guardando  = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.mensaje || 'Error al guardar la configuración.';
        this.guardando = false;
      }
    });
  }

  /** Navega al primer tab que tenga campos inválidos */
  private getFirstInvalidTab(): string {
    const basicosFields = ['razonSocial'];
    const direccionFields = ['direccion', 'pais'];
    const contactoFields = ['emailPrincipal'];
    const monedaFields = ['codigoMoneda', 'simboloMoneda', 'posicionSimbolo', 'decimales'];

    if (basicosFields.some(f => this.form.get(f)?.invalid))  return 'basicos';
    if (direccionFields.some(f => this.form.get(f)?.invalid)) return 'direccion';
    if (contactoFields.some(f => this.form.get(f)?.invalid))  return 'contacto';
    if (monedaFields.some(f => this.form.get(f)?.invalid))    return 'moneda';
    return 'basicos';
  }

  isInvalid(campo: string): boolean {
    const ctrl = this.form.get(campo);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
