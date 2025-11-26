import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

interface ProductoCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {
  carrito: ProductoCarrito[] = [];
  cargando = true;
  toastMessage: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.carritoService.getCarrito().subscribe({
      next: (res) => {

        const productos = res?.productos ?? [];

        // Filtra nulls y valida estructura
        this.carrito = productos
          .filter((item: any) => item && item.producto)
          .map((item: any) => ({
            producto: item.producto,
            cantidad: item.cantidad ?? 1,
          }));

        this.cargando = false;
      },
      error: (err) => console.error('Error al cargar carrito', err),
    });
  }

  aumentar(item: ProductoCarrito) {
    item.cantidad++;
    this.actualizarCarrito(item);
  }

  disminuir(item: ProductoCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCarrito(item);
    } else {
      this.eliminar(item);
    }
  }

  actualizarCarrito(item: ProductoCarrito) {
    this.carritoService
      .agregarAlCarrito(item.producto._id!, item.cantidad)
      .subscribe({
        next: () => this.showToast(`"${item.producto.nombre}" actualizado`),
        error: (err) => console.error(err),
      });
  }

  eliminar(item: ProductoCarrito) {
    this.carritoService.eliminarDelCarrito(item.producto._id!).subscribe({
      next: () => {
        this.carrito = this.carrito.filter(
          (p) => p.producto._id !== item.producto._id
        );
        this.showToast(`"${item.producto.nombre}" eliminado`);
      },
      error: (err) => console.error(err),
    });
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito().subscribe({
      next: () => {
        this.carrito = [];
        this.showToast('Carrito vaciado');
      },
      error: (err) => console.error(err),
    });
  }

  obtenerTotal(): string {
    return this.carrito
      .reduce((sum, item) => {
        const precio = Number(item.producto?.precio);
        return isNaN(precio) ? sum : sum + precio * item.cantidad;
      }, 0)
      .toFixed(2);
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => (this.toastMessage = null), 2500);
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }

  irACompra() {
    this.router.navigate(['/checkout']);
  }
}
