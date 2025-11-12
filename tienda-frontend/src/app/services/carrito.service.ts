import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  constructor() {}

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  agregarProducto(producto: Producto): void {
    this.carrito.push(producto);
  }

  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1);
  }

  vaciarCarrito(): void {
    this.carrito = [];
  }

  obtenerTotal(): number {
    return this.carrito.reduce((total, prod) => total + prod.precio, 0);
  }
}
