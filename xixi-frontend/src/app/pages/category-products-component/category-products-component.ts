// ------------------------------------------------------
// Lista de productos filtrados por categoría.
// Usa la ruta /category/:id
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';

import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-products',
  standalone: true,
  templateUrl: './category-products-component.html',
  styleUrls: ['./category-products-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class CategoryProductsComponent implements OnInit {
  products: Product[] = [];
  category: Category | null = null;

  loading = false;
  errorMessage = '';

  // para manejar estado de botones "Agregar al carrito"
  adding: { [productId: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.loadCategory(categoryId);
      this.loadProducts(categoryId);
    } else {
      this.errorMessage = 'ID de categoría inválido';
    }
  }

  loadCategory(id: string): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.category = resp.data;
        }
      },
      error: () => {
        // si falla el nombre de la categoría no rompemos la vista
      },
    });
  }

  loadProducts(categoryId: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts({ categoryId }).subscribe({
      next: (resp: any) => {
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
          err?.error?.message || 'Error al cargar productos';
      },
    });
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/300x300?text=XI-XI';
  }

  // --------- Agregar al carrito desde categoría ----------
  addToCart(product: Product): void {
    if (!product._id) {
      console.error(
        'Producto sin _id, no se puede agregar al carrito',
        product
      );
      alert('Producto inválido, no se pudo agregar al carrito.');
      return;
    }

    // Igual que en la lista general: si no está logueado → login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.adding[product._id] = true;

    this.cartService.addToCart(product._id, 1).subscribe({
      next: (resp: any) => {
        this.adding[product._id] = false;

        if (!resp.success) {
          alert(resp.message || 'No se pudo agregar al carrito.');
          return;
        }

        console.log('Producto agregado al carrito desde categoría', resp);
      },
      error: (err) => {
        this.adding[product._id] = false;

        const status = err?.status;
        const backendMessage = err?.error?.message;

        if (status === 401) {
          alert('Debes iniciar sesión para agregar productos al carrito.');
        } else {
          alert(backendMessage || 'No se pudo agregar al carrito.');
        }

        console.error('Error al agregar al carrito:', err);
      },
    });
  }
}
