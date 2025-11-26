import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [NgFor],
  templateUrl: './listar-categorias.component.html',
})
export class ListarCategoriasComponent {
  categorias: any[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.categoriaService.getCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }
}
