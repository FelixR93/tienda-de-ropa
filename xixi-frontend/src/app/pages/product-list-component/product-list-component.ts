// ------------------------------------------------------
// Listado general de productos.
// Incluye buscador + botón "Agregar al carrito".
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';

  // estado por producto para el botón
  adding: { [productId: string]: boolean } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService
      .getProducts({
        search: this.searchTerm || undefined,
      })
      .subscribe({
        next: (resp) => {
          this.loading = false;
          if (resp.success) {
            this.products = resp.data;
          } else {
            this.errorMessage =
              resp.message || 'No se pudieron cargar los productos';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err?.error?.message || 'Error al cargar los productos';
        },
      });
  }

  onSearch(): void {
    this.loadProducts();
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/300x300?text=XI-XI';
  }

  getCategoryName(product: Product): string {
    const category: any = product.category;

    if (!category) return '';

    if (typeof category === 'string') {
      return '';
    }

    return category.name || '';
  }

  // --------------------------------------------------
  // Agregar al carrito desde la lista
  // --------------------------------------------------
  addToCart(product: Product): void {
    if (!product || !product._id) {
      console.warn('Producto sin _id, no se puede agregar al carrito');
      return;
    }

    // Si no está logueado, lo mandamos a login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/products' },
      });
      return;
    }

    const id = product._id as string;
    this.adding[id] = true;

    this.cartService.addToCart(id, 1).subscribe({
      next: () => {
        this.adding[id] = false;
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
        this.adding[id] = false;
        alert(err?.error?.message || 'No se pudo agregar al carrito');
      },
    });
  }
}
