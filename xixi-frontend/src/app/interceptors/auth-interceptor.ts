// ------------------------------------------------------
// Interceptor HTTP para agregar el token JWT a cada
// petición saliente, si el usuario está logueado.
// Usa AuthService.getToken() (que ya es SSR-safe).
// ------------------------------------------------------
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Esto ya maneja SSR (no toca localStorage en servidor)
  const token = authService.getToken();

  if (!token) {
    // Si no hay token, dejamos pasar la request tal cual
    return next(req);
  }

  // Clonamos la request y agregamos el header Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
