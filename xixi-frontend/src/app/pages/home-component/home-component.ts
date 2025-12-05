// ------------------------------------------------------
// Home XI-XI
// - Si NO está logueado: landing tipo tienda (entrada)
// - Si está logueado: home de la tienda (categorías + destacados)
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

import { LoaderComponent } from '../../shared/loader-component/loader-component';
import { ProductCardComponent } from '../../shared/product-card-component/product-card-component';
import { AuthService } from '../../services/auth-service';

interface BannerSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    ProductCardComponent,
  ],
})
export class HomeComponent implements OnInit {
  // 🔹 Carrusel principal (imágenes ONLINE)
  bannerSlides: BannerSlide[] = [
    {
      image:
        'https://www.informador.mx/__export/1674674549037/sites/elinformador/img/2023/01/25/istock-1350027417_1.jpg_1970638775.jpg',
      title: 'Colección Urbana XI-XI',
      subtitle: 'Ropa cómoda y moderna para tu día a día.',
      ctaText: 'Ver colección',
      ctaLink: '/products',
    },
    {
      image:
        'https://media.gq.com.mx/photos/633f2c39298d454212558297/1:1/w_960,c_limit/ropa-basica-de-hombre-para-look-deportivo-y-casual.jpg',
      title: 'Estilo Casual',
      subtitle: 'Camisas, jeans y más para un look relajado.',
      ctaText: 'Novedades',
      ctaLink: '/products',
    },
    {
      image:
        'https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/593571770_1317394403755570_3108991770981890287_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=76QieOtdEzkQ7kNvwGA6-vr&_nc_oc=Admf8eUlFLcgJeYt4-gxYHG0L2g5M5sxH_7Ep611kcBsrQYUimJsHcEfSScPEZABuw0&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=w_QTrMsD5pr0UmZ0rB1MWQ&oh=00_Afligs4GLdzc0uUp_5yM79o0bF8W_Q1A4gDga_inLxARzQ&oe=6937610E',
      title: 'Ofertas de temporada',
      subtitle: 'Descuentos especiales en prendas seleccionadas.',
      ctaText: 'Ver ofertas',
      ctaLink: '/products',
    },
  ];

  // 🔹 Bloques grandes del landing (entrada de tienda)
  landingBlocks = [
    {
      image:
        'https://hips.hearstapps.com/hmg-prod/images/gettyimages-1795339657-6597e3abc973b.jpg?resize=768:*',
      label: 'Mujer',
      description: 'Colecciones modernas para todos los días.',
      targetCategory: null,
    },
    {
      image:
        'https://media.glamour.mx/photos/6689611c0647c979e2f24cd7/master/w_960,c_limit/Outfit%20hombre%20bermudas.jpg',
      label: 'Hombre',
      description: 'Estilos urbanos y casuales.',
      targetCategory: null,
    },
    {
      image:
        'https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI',
      label: 'Accesorios',
      description: 'Detalles que completan tu outfit.',
      targetCategory: null,
    },
  ];

  currentBannerIndex = 0;

  featuredProducts: Product[] = [];
  categories: Category[] = [];

  loadingProducts = false;
  loadingCategories = false;
  errorMessageProducts = '';
  errorMessageCategories = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  // --------- Login / estado ----------
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToRegister(): void {
    this.router.navigate(['/register'], {
      queryParams: { from: 'landing' },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onLandingBlockClick(block: any): void {
    if (!this.isLoggedIn()) {
      this.goToRegister();
      return;
    }

    if (block.targetCategory) {
      this.router.navigate(['/category', block.targetCategory]);
    } else {
      this.router.navigate(['/products']);
    }
  }

  // --------- Carrusel ----------
  nextBanner(): void {
    this.currentBannerIndex =
      (this.currentBannerIndex + 1) % this.bannerSlides.length;
  }

  prevBanner(): void {
    this.currentBannerIndex =
      (this.currentBannerIndex - 1 + this.bannerSlides.length) %
      this.bannerSlides.length;
  }

  goToBanner(index: number): void {
    this.currentBannerIndex = index;
  }

  // --------- Carga de datos dinámicos ----------
  loadFeaturedProducts(): void {
    this.loadingProducts = true;
    this.errorMessageProducts = '';

    this.productService.getProducts({}).subscribe({
      next: (resp: any) => {
        this.loadingProducts = false;
        if (resp.success && Array.isArray(resp.data)) {
          this.featuredProducts = resp.data.slice(0, 8);
        } else {
          this.errorMessageProducts =
            resp.message || 'No se pudieron cargar los productos destacados.';
        }
      },
      error: (err) => {
        this.loadingProducts = false;
        this.errorMessageProducts =
          err?.error?.message || 'Error al cargar productos destacados.';
      },
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.errorMessageCategories = '';

    this.categoryService.getCategories().subscribe({
      next: (resp: any) => {
        this.loadingCategories = false;
        if (resp.success && Array.isArray(resp.data)) {
          this.categories = resp.data;
        } else {
          this.errorMessageCategories =
            resp.message || 'No se pudieron cargar las categorías.';
        }
      },
      error: (err) => {
        this.loadingCategories = false;
        this.errorMessageCategories =
          err?.error?.message || 'Error al cargar categorías.';
      },
    });
  }
}
