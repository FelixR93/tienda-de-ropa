// ------------------------------------------------------
// Navbar principal de XI-XI (versión limpia).
// ------------------------------------------------------
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart-service';
import { CategoryService } from '../../services/category-service';

import { User } from '../../models/user.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartCount = 0;

  isMenuOpen = false;          // menú mobile
  isCategoriesOpen = false;    // dropdown de categorías

  categories: Category[] = [];

  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const subUser = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.subs.push(subUser);

    const subCart = this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
    this.subs.push(subCart);

    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart().subscribe();
    }

    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // si abro menú mobile, cierro dropdown de categorías
    if (this.isMenuOpen) {
      this.isCategoriesOpen = false;
    }
  }

  toggleCategories(): void {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }

  closeMenus(): void {
    this.isMenuOpen = false;
    this.isCategoriesOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/']);
  }

  goToAdmin(): void {
    this.closeMenus();
    this.router.navigate(['/admin']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (resp: any) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.categories = resp.data;
        }
      },
      error: (err: any) => {
        console.error('Error al cargar categorías en navbar:', err);
      },
    });
  }
}
