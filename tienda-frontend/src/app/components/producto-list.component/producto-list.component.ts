import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

interface ProductoUI extends Producto {
  flipped?: boolean;
  precioNumber: number;
  cantidadSeleccionada?: number;
}

interface CarritoItem {
  producto: Producto;
  cantidad: number;
  precioNumber: number;
}

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
})
export class ProductoListComponent implements OnInit {
  step = 1;
  productos: ProductoUI[] = [];
  carrito: CarritoItem[] = [];
  cargando = true;
  toastMessage: string | null = null;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCarrito();
  }

  // Wizard
  next() { if (this.step < 3) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data
          .filter(p => p) // evita null
          .map((p) => ({
            ...p,
            flipped: false,
            precioNumber: Number(p.precio || 0),
            cantidadSeleccionada: 1,
            imagen: `http://localhost:5000${p.imagen}`, 
          }));
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  cargarCarrito() {
    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = (data.productos || []).map((item: any) => ({
          producto: item.producto,
          cantidad: item.cantidad,
          precioNumber: Number(item.producto.precio),
        }));
      },
    });
  }

  toggleFlip(producto: ProductoUI) {
    producto.flipped = !producto.flipped;
  }

  // Cantidad
  aumentarCantidad(producto: ProductoUI) {
    producto.cantidadSeleccionada = (producto.cantidadSeleccionada || 1) + 1;
  }

  disminuirCantidad(producto: ProductoUI) {
    if ((producto.cantidadSeleccionada || 1) > 1) {
      producto.cantidadSeleccionada = (producto.cantidadSeleccionada || 1) - 1;
    }
  }

  agregarAlCarrito(producto: ProductoUI, cantidad: number = 1) {
    const existe = this.carrito.find((i) => i.producto._id === producto._id);

    if (existe) existe.cantidad += cantidad;
    else {
      this.carrito.push({
        producto,
        cantidad,
        precioNumber: Number(producto.precioNumber),
      });
    }

    this.showToast(`"${producto.nombre}" agregado al carrito`);
    this.carritoService.agregarAlCarrito(producto._id!, cantidad).subscribe();
  }

  obtenerTotal() {
    return this.carrito.reduce((sum, i) => sum + i.precioNumber * i.cantidad, 0).toFixed(2);
  }

  cantidadTotal() {
    return this.carrito.reduce((s, i) => s + i.cantidad, 0);
  }

  irACarrito() {
    this.router.navigate(['/carrito']);
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = null), 2000);
  }

  editar(id: string) {
    this.router.navigate(['/producto/editar', id]);
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro deseas eliminar este producto?')) return;
    this.productoService.eliminarProducto(id).subscribe(() => {
      this.productos = this.productos.filter((p) => p._id !== id);
    });
  }
}
