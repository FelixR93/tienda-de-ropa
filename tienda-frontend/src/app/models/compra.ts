import { Producto } from './producto';

export interface Compra {
  _id?: string;
  productos: Producto[];
  total: number;
  fecha: Date;
}
