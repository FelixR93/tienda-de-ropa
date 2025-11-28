import { Usuario } from './usuario';

export interface AuthResponse {
  ok: boolean;
  msg?: string;
  token: string;
  usuario: Usuario;
}
