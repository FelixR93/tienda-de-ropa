import { Producto } from './producto';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

export interface Carrito {
  _id?: string;
  productos: CarritoItem[];
  total: number;
}
