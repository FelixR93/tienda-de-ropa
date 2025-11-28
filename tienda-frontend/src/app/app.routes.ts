import { Routes } from '@angular/router';

// ===============================
// AUTH
// ===============================
import { LoginComponent } from './auth/login.component/login.component';
import { RegisterComponent } from './auth/register.component/register.component';

// Guards
import { authGuard } from './auth/auth-guard';
import { roleGuard } from './auth/role-guard';

// ===============================
// HOME
// ===============================
import { HomeComponent } from './page/home/home.component/home.component';

// ===============================
// PRODUCTOS
// ===============================
import { ProductoListComponent } from './components/producto-list.component/producto-list.component';
import { ProductoFormComponent } from './components/producto-form.component/producto-form.component';

// ===============================
// CATEGORÍAS
// ===============================
import { ListarCategoriasComponent } from './page/categorias/listar-categorias.component/listar-categorias.component';
import { CrearCategoriaComponent } from './page/categorias/crear-categoria.component/crear-categoria.component';

// ===============================
// PROVEEDORES
// ===============================
import { ListarProveedoresComponent } from './page/categorias/listar-proveedores.component/listar-proveedores.component';
import { CrearProveedorComponent } from './page/categorias/crear-proveedor.component/crear-proveedor.component';

// ===============================
// CARRITO Y COMPRAS
// ===============================
import { CarritoComponent } from './components/carrito.component/carrito.component';
import { ComprasRealizadasComponent } from './components/compras-realizadas.component/compras-realizadas.component';


// =====================================================
// RUTAS COMPLETAS
// =====================================================
export const routes: Routes = [

  // ============================
  // PÚBLICAS
  // ============================
  { path: '', component: HomeComponent },

  // Login y registro (solo si NO está logueado)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ============================
  // PRODUCTOS (solo usuarios logueados)
  // ============================
  {
    path: 'productos',
    component: ProductoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'producto/nuevo',
    component: ProductoFormComponent,
    canActivate: [authGuard, roleGuard], // SOLO ADMIN
    data: { roles: ['admin'] }
  },
  {
    path: 'producto/editar/:id',
    component: ProductoFormComponent,
    canActivate: [authGuard, roleGuard], // SOLO ADMIN
    data: { roles: ['admin'] }
  },

  // ============================
  // CATEGORÍAS (solo admin)
  // ============================
  {
    path: 'categorias',
    component: ListarCategoriasComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'categorias/nueva',
    component: CrearCategoriaComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },

  // ============================
  // PROVEEDORES (solo admin)
  // ============================
  {
    path: 'proveedores',
    component: ListarProveedoresComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'proveedores/nuevo',
    component: CrearProveedorComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },

  // ============================
  // CARRITO Y COMPRAS (usuario normal o admin)
  // ============================
  {
    path: 'carrito',
    component: CarritoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'compras',
    component: ComprasRealizadasComponent,
    canActivate: [authGuard]
  },

  // ============================
  // 404
  // ============================
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
