import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

import { AuthResponse } from '../models/auth-response';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private API_URL = 'http://localhost:5000/api/auth';

  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$ = this.usuarioActual.asObservable();

  constructor() {
    // No llamar directamente a localStorage aquí para evitar errores en SSR
  }

  /** Inicializa usuario desde localStorage (llamar desde AppComponent) */
  initLocalStorage() {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    this.obtenerPerfil().subscribe({
      next: (resp) => this.usuarioActual.next(resp.usuario),
      error: () => this.logout()
    });
  }

  /** Registro */
  register(data: Partial<Usuario>) {
    // Aseguramos que no haya campos nulos
    const usuario: Usuario = {
      role: data.role || 'cliente',
      nombre: data.nombre || '',
      apellido: data.apellido || '',
      email: data.email || '',
      password: data.password || '',
      telefono: data.telefono || '',
      direccion: data.direccion || '',
      ciudad: data.ciudad || '',
      estado: data.estado || '',
      codigoPostal: data.codigoPostal || '',
      fechaNacimiento: data.fechaNacimiento || new Date(),
      genero: data.genero || ''
    };
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, usuario);
  }

  /** Login */
  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((resp) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', resp.token);
        }
        this.usuarioActual.next(resp.usuario);
      })
    );
  }

  /** Obtener perfil */
  obtenerPerfil() {
    return this.http.get<AuthResponse>(`${this.API_URL}/perfil`);
  }

  /** Usuario actual */
  get usuario(): Usuario | null {
    return this.usuarioActual.value;
  }

  /** Validar roles */
  tieneRol(rolesPermitidos: string[]): boolean {
    if (!this.usuario) return false;
    return rolesPermitidos.includes(this.usuario.role);
  }

  /** Logout */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.usuarioActual.next(null);
    this.router.navigate(['/login']);
  }
}
