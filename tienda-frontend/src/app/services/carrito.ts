import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class Carrito {

  private carrito: Producto[] = [];

  constructor() {}

  agregarProducto(producto: Producto): void {
    this.carrito.push(producto);
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1);
  }

  obtenerTotal(): number {
    return this.carrito.reduce((total, item) => total + item.precio, 0);
  }

  vaciarCarrito(): void {
    this.carrito = [];
  }
}
