import { Routes } from '@angular/router';
import { Productos } from './components/productos/productos';
import { Carrito } from './components/carrito/carrito';
import { ProductoService } from './services/producto.service';
import { CarritoService } from './services/carrito.service';

export const routes: Routes = [
  { path: 'productos', component: Productos },
  { path: 'carrito', component: Carrito },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'productos' },
  { path: 'producto/:id', component: ProductoService as any }, // Ajusta según tu configuración
  { path: 'carrito', component: CarritoService as any }, // Ajusta según tu configuración
  { path: 'productos', component: Productos as any } // Ajusta según tu configuración
];
