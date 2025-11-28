import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit {

  productoForm!: FormGroup;
  cargando = false;
  mensaje = '';

  imagenFile: File | null = null;
  imagenURL: string | null = null;

  modoEdicion = false;
  idProducto: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagen: ['']
    });

    this.idProducto = this.route.snapshot.paramMap.get('id');

    if (this.idProducto) {
      this.modoEdicion = true;
      this.cargarProducto();
    }
  }

  cargarProducto() {
    this.productoService.getProducto(this.idProducto!).subscribe(prod => {
      const p = prod.producto || prod;

      this.productoForm.patchValue({
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: p.stock,
        imagen: p.imagen
      });

      if (p.imagen) {
        this.imagenURL = `http://localhost:5000${p.imagen}`;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagenURL = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.productoForm.invalid) {
      this.mensaje = 'Completa todos los campos correctamente';
      return;
    }

    this.cargando = true;

    const formData = new FormData();
    formData.append('nombre', this.productoForm.value.nombre);
    formData.append('descripcion', this.productoForm.value.descripcion);
    formData.append('precio', this.productoForm.value.precio);
    formData.append('stock', this.productoForm.value.stock);

    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile); // nombre EXACTO que multer requiere
    }

    if (this.modoEdicion) {
      this.productoService.actualizarProducto(this.idProducto!, formData).subscribe({
        next: () => {
          this.mensaje = "Producto actualizado correctamente";
          this.cargando = false;
          this.router.navigate(['/productos']);
        },
        error: () => {
          this.mensaje = "Error al actualizar el producto";
          this.cargando = false;
        }
      });
    } else {
      this.productoService.crearProductoConImagen(formData).subscribe({
        next: () => {
          this.mensaje = "Producto creado correctamente";
          this.cargando = false;
          this.productoForm.reset();
          this.imagenURL = null;
        },
        error: () => {
          this.mensaje = "Error al crear el producto";
          this.cargando = false;
        }
      });
    }
  }

  redirigir() {
    this.router.navigate(['/productos']);
  }
}
