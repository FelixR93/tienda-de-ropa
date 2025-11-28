import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  cargando = false;
  errorMsg = '';
  form;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.form.invalid) {
      this.errorMsg = 'Completa los campos correctamente';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const datos = this.form.getRawValue();
    this.authService.login(datos).subscribe({
      next: () => {
        this.cargando = false;
        // Redirigir según rol
        if (this.authService.tieneRol(['admin'])) {
          this.router.navigate(['/admin']);
        } else if (this.authService.tieneRol(['tecnico'])) {
          this.router.navigate(['/tecnico']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.cargando = false;
        this.errorMsg = err.error?.msg || 'Credenciales incorrectas';
      },
    });
  }
}
