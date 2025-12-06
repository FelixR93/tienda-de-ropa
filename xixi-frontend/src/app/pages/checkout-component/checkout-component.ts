// ------------------------------------------------------
// Checkout XI-XI
// - Muestra resumen del carrito
// - Permite ingresar dirección de envío
// - Llama a /api/orders/checkout
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  Cart,
  CartItem,
  CartService,
} from '../../services/cart-service';
import { OrderService, Order } from '../../services/order-service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout-component.html',
  styleUrls: ['./checkout-component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;

  cart: Cart | null = null;
  loadingCart = false;
  errorMessage = '';

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(5)]],
      notes: [''],
    });

    this.loadCart();
  }

  loadCart(): void {
    this.loadingCart = true;
    this.errorMessage = '';

    this.cartService.loadCart().subscribe({
      next: (resp: ApiResponse<Cart>) => {
        this.loadingCart = false;
        if (resp.success) {
          this.cart = resp.data;
        } else {
          this.errorMessage =
            resp.message || 'No se pudo cargar el carrito.';
        }
      },
      error: (err: any) => {
        this.loadingCart = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar el carrito.';
      },
    });
  }

  // Nombre amigable del ítem (evita problemas con product: string | Product)
  getItemName(item: CartItem): string {
    const p: any = item.product;
    if (!p) return 'Producto';
    if (typeof p === 'string') return 'Producto';
    return p.name || 'Producto';
  }

  onSubmit(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.errorMessage = 'No hay productos en el carrito.';
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const payload = {
      shippingAddress: this.checkoutForm.value.shippingAddress,
      notes: this.checkoutForm.value.notes || '',
    };

    this.submitting = true;
    this.errorMessage = '';

    this.orderService.checkout(payload).subscribe({
      next: (resp: ApiResponse<Order>) => {
        this.submitting = false;

        if (!resp.success) {
          this.errorMessage =
            resp.message || 'No se pudo crear la orden.';
          return;
        }

        // Redirigimos a "Mis pedidos"
        this.router.navigate(['/my-orders']);
      },
      error: (err: any) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message || 'Error al procesar el checkout.';
      },
    });
  }
}
