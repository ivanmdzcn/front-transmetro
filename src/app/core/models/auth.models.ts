// ── Request ──────────────────────────────────────────────────────────
export interface LoginRequest {
  identificador: string;  // Email o nombre de usuario
  contrasena:    string;
}

// ── Responses ─────────────────────────────────────────────────────────
export interface LoginResponse {
  token:      string;
  nombre:     string;
  email:      string;
  nombreRol:  string | null;
  expiracion: Date;
}

export interface MiPerfilResponse {
  id:            number;
  nombre:        string;
  nombreUsuario: string;
  email:         string;
  rol:           string | null;
  permisos:      string[];
}

// ── Sesión local ──────────────────────────────────────────────────────
export interface UserSession {
  token:      string;
  nombre:     string;
  email:      string;
  rol:        string | null;
  expiracion: Date;
  permisos:   string[];
}
