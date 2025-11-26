import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private url = 'http://localhost:5000/api/carrito';
  private carritoId: string = '6924f78b0b71a12be79d2724';

  constructor(private http: HttpClient) {}

  // Obtener carrito
  getCarrito(): Observable<any> {
    return this.http.get(`${this.url}/${this.carritoId}`);
  }

  // Agregar producto al carrito
  agregarAlCarrito(productoId: string, cantidad: number): Observable<any> {
    return this.http.post(`${this.url}/${this.carritoId}/productos`, { productoId, cantidad });
  }

  // Eliminar producto del carrito
  eliminarDelCarrito(productoId: string): Observable<any> {
    return this.http.delete(`${this.url}/${this.carritoId}/productos`, { body: { productoId } });
  }

  // Vaciar carrito
  vaciarCarrito(): Observable<any> {
    return this.http.delete(`${this.url}/${this.carritoId}`);
  }

  // -------------------------------
  // Nuevo: obtener compras realizadas
  // -------------------------------
  getComprasRealizadas(): Observable<any> {
    return this.http.get(`${this.url}/${this.carritoId}/compras`);
  }
}
