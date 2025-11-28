export interface Usuario {
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  password: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  estado?: string | null;
  codigoPostal?: string | null;
  fechaNacimiento?: string | Date | null;
  genero?: string | null;
  role: string;
}
