import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  cargando = false;
  errorMsg = '';

  form;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      aceptarTerminos: [false, [Validators.requiredTrue]],
    });
  }

  register() {
    if (this.form.invalid) {
      this.errorMsg = 'Completa todos los campos correctamente.';
      return;
    }

    const { password, confirmarPassword, ...datosEnviar } = this.form.getRawValue();

    if (password !== confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    // Convertir valores vacíos o null a undefined para que TypeScript/Backend no falle
    const usuario = {
      ...Object.fromEntries(
        Object.entries(datosEnviar).map(([k, v]) => [k, v === null || v === '' ? undefined : v])
      ),
      password, // agregar password
      role: 'cliente' // valor por defecto
    };

    this.errorMsg = '';
    this.cargando = true;

    this.authService.register(usuario).subscribe({
      next: () => {
        this.cargando = false;
        alert('Usuario registrado correctamente. Por favor inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.cargando = false;
        this.errorMsg = err.error?.msg || 'Error al registrar usuario';
      },
    });
  }
}
