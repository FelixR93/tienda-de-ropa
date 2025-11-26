import { Routes } from '@angular/router';

// Productos
import { ProductoListComponent } from './components/producto-list.component/producto-list.component';
import { ProductoFormComponent } from './components/producto-form.component/producto-form.component';

// Carrito y compras
import { CarritoComponent } from './components/carrito.component/carrito.component';
import { ComprasRealizadasComponent } from './components/compras-realizadas.component/compras-realizadas.component';

// Home
import { HomeComponent } from './page/home/home.component/home.component';

// Categorías
import { ListarCategoriasComponent } from './page/categorias/listar-categorias.component/listar-categorias.component';
import { CrearCategoriaComponent } from './page/categorias/crear-categoria.component/crear-categoria.component';

// Proveedores
import { ListarProveedoresComponent } from './page/categorias/listar-proveedores.component/listar-proveedores.component';
import { CrearProveedorComponent } from './page/categorias/crear-proveedor.component/crear-proveedor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Productos
  { path: 'productos', component: ProductoListComponent },
  { path: 'producto/nuevo', component: ProductoFormComponent },
  { path: 'producto/editar/:id', component: ProductoFormComponent },

  // Categorías
  { path: 'categorias', component: ListarCategoriasComponent },
  { path: 'categorias/nueva', component: CrearCategoriaComponent },

  // Proveedores
  { path: 'proveedores', component: ListarProveedoresComponent },
  { path: 'proveedores/nuevo', component: CrearProveedorComponent },

  // Otros
  { path: 'carrito', component: CarritoComponent },
  { path: 'compras', component: ComprasRealizadasComponent },

  // Ruta por defecto para no encontrados
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
