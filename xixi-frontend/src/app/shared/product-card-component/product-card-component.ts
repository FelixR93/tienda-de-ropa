// ------------------------------------------------------
// Card reutilizable de producto XI-XI
// - Muestra imagen, nombre, precio, stock
// - Botón "Ver detalle"
// - Botón "Agregar al carrito"
// ------------------------------------------------------
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card-component.html',
  styleUrls: ['./product-card-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class ProductCardComponent {
  @Input() product!: Product;

  adding = false; // estado del botón "Agregar"

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  get mainImage(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[0];
    }
    return 'https://via.placeholder.com/400x400?text=XI-XI';
  }

  goToDetail(): void {
    if (!this.product || !this.product._id) return;
    this.router.navigate(['/products', this.product._id]);
  }

  addToCart(): void {
    if (!this.product || !this.product._id) {
      console.warn('Producto sin _id, no se puede agregar al carrito');
      return;
    }

    // Si no está logueado, lo mandamos al login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    const id = this.product._id as string;
    this.adding = true;

    this.cartService.addToCart(id, 1).subscribe({
      next: () => {
        this.adding = false;
      },
      error: (err) => {
        this.adding = false;
        console.error('Error al agregar al carrito', err);
        alert(err?.error?.message || 'No se pudo agregar al carrito');
      },
    });
  }
}
