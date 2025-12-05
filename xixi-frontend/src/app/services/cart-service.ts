import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

const API_BASE_URL = 'http://localhost:4000/api';

export interface CartItem {
  product: Product | string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCart(): Observable<CartResponse> {
    return this.http
      .get<CartResponse>(`${API_BASE_URL}/cart`)
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  addToCart(productId: string, quantity = 1): Observable<CartResponse> {
    return this.http
      .post<CartResponse>(`${API_BASE_URL}/cart/items`, { productId, quantity })
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  updateItem(productId: string, quantity: number): Observable<CartResponse> {
    return this.http
      .put<CartResponse>(`${API_BASE_URL}/cart/items/${productId}`, { quantity })
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  removeItem(productId: string): Observable<CartResponse> {
    return this.http
      .delete<CartResponse>(`${API_BASE_URL}/cart/items/${productId}`)
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  clearCart(): Observable<CartResponse> {
    return this.http
      .delete<CartResponse>(`${API_BASE_URL}/cart`)
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  private updateCountFromCart(resp: CartResponse): void {
    if (!resp.success || !resp.data) {
      this.cartCountSubject.next(0);
      return;
    }

    const totalItems = (resp.data.items || []).reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    this.cartCountSubject.next(totalItems);
  }
}
