import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  crearProductoConImagen(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/productos`, formData);
  }

  getProductos() {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  getProducto(id: string) {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`);
  }

  actualizarProducto(id: string, formData: FormData) {
    return this.http.put<any>(`${this.apiUrl}/productos/${id}`, formData);
  }

  eliminarProducto(id: string) {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
