import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado?: Producto; // ✅ Agregado

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => (this.productos = data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    alert(`"${producto.nombre}" agregado al carrito`);
  }

  verDetalles(producto: Producto): void { // ✅ Agregado
    this.productoSeleccionado = producto;
  }

  toggleDetalles(producto: any): void {
  producto.mostrarDetalles = !producto.mostrarDetalles;
  }

  toggleFlip(producto: any): void {
  producto.flipped = !producto.flipped;
}


}
