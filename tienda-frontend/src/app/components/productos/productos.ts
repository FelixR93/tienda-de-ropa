import { Component, OnInit } from '@angular/core';
import { Producto } from '../../services/producto';
import { Carrito } from '../../services/carrito';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.html'
})
export class Productos implements OnInit {
  productos: Producto[] = [];

  constructor(
    private producto: Producto,
    private carrito: Carrito
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.producto.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carrito.agregarProducto(producto);
    alert(`"${producto.nombre}" agregado al carrito`);
  }
}
