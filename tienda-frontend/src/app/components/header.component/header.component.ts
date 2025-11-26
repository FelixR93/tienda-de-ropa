import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuAbiertoFlag = false;
  carritoCantidad = 0;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit(): void {
    this.carritoService.getCarrito().subscribe(res => {
      this.carritoCantidad = (res.productos || []).reduce(
        (sum: number, p: any) => sum + p.cantidad, 0
      );
    });
  }

  toggleMenu() {
    this.menuAbiertoFlag = !this.menuAbiertoFlag;
  }

  menuAbierto(): boolean {
    return this.menuAbiertoFlag;
  }

  cerrarMenu() {
    this.menuAbiertoFlag = false;
  }

  cantidadTotal(): number {
    return this.carritoCantidad;
  }
}
