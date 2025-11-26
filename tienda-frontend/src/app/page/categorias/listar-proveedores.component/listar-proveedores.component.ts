import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorService, Proveedor } from '../../../services/proveedor.service';

@Component({
  selector: 'app-listar-proveedores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-proveedores.component.html',
  styleUrls: ['./listar-proveedores.component.scss']
})
export class ListarProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.proveedorService.getProveedores()
      .subscribe((data: Proveedor[]) => {
        this.proveedores = data;
      }, (error) => console.error(error));
  }
}
