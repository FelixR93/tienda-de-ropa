import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: Producto[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  eliminarProducto(index: number): void {
  this.carritoService.eliminarProducto(index);
  this.carrito = this.carritoService.obtenerCarrito();
  }


  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.carrito = [];
  }

  obtenerTotal(): number {
    return this.carritoService.obtenerTotal();
  }
}
