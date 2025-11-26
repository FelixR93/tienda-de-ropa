// compras-realizadas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { RouterModule } from '@angular/router';

interface Compra {
  _id: string;
  fecha: string;
  total: number;
  productos: { nombre: string; cantidad: number; precio: number }[];
}

@Component({
  selector: 'app-compras-realizadas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compras-realizadas.component.html',
  styleUrls: ['./compras-realizadas.component.scss']
})
export class ComprasRealizadasComponent implements OnInit {
  compras: Compra[] = [];
  cargando = true;
  toastMessage: string | null = null;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.cargarCompras();
  }

  cargarCompras() {
    this.carritoService.getComprasRealizadas().subscribe({
      next: (res) => {
        this.compras = res.compras || [];
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar compras realizadas:', err);
        this.cargando = false;
        this.showToast('Error al cargar tus compras');
      }
    });
  }

  obtenerSubtotal(producto: { cantidad: number; precio: number }) {
    return (producto.cantidad * producto.precio).toFixed(2);
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => (this.toastMessage = null), 2500);
  }
}
