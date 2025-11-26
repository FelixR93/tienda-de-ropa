import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Crear producto con imagen
  crearProductoConImagen(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/productos`, formData);
  }

  // Obtener todos
  getProductos() {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  // Obtener uno
  getProducto(id: string) {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`);
  }

  // Actualizar producto
  actualizarProducto(id: string, formData: FormData) {
    return this.http.put<any>(`${this.apiUrl}/productos/${id}`, formData);
  }

  // Eliminar producto
  eliminarProducto(id: string) {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
