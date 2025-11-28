import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ← ruta corregida

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos = route.data['roles'] as string[];

  if (authService.usuario && authService.tieneRol(rolesPermitidos)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
