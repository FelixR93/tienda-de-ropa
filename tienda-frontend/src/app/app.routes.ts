import { Routes } from '@angular/router';
import { Productos } from './components/productos/productos';
import { ProductoService } from './services/producto.service';
import { CarritoService } from './services/carrito.service';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
  { path: 'productos', component: Productos },
  { path: 'carrito', component: CarritoComponent },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'productos' },
  { path: 'producto/:id', component: ProductoService as any }, // Ajusta según tu configuración
  { path: 'carrito', component: CarritoComponent }, // Ajusta según tu configuración
  { path: 'productos', component: Productos as any } // Ajusta según tu configuración
];
