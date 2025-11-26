import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.scss']
})
export class CrearCategoriaComponent {
  nombre = '';
  mensajeExito = '';

  constructor(private categoriaService: CategoriaService) {}

  crear() {
    if (!this.nombre.trim()) return;

    this.categoriaService.crearCategoria({ nombre: this.nombre })
      .subscribe({
        next: () => {
          this.mensajeExito = 'Categoría creada correctamente';
          this.nombre = '';
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => console.error('Error:', err)
      });
  }
}
