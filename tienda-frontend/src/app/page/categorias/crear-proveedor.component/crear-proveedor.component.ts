import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService, Proveedor } from '../../../services/proveedor.service';

@Component({
  selector: 'app-crear-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss']
})
export class CrearProveedorComponent {
  nombre = '';
  telefono = '';
  mensajeExito = '';

  constructor(private proveedorService: ProveedorService) {}

  crear() {
    if (!this.nombre.trim()) return;

    const nuevoProveedor: Proveedor = {
      nombre: this.nombre,
      telefono: this.telefono
    };

    this.proveedorService.crearProveedor(nuevoProveedor)
      .subscribe({
        next: () => {
          this.mensajeExito = 'Proveedor creado correctamente';
          this.nombre = '';
          this.telefono = '';
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => console.error('Error:', err)
      });
  }
}
