// ------------------------------------------------------
// Interceptor HTTP global para manejar el loader.
// Cada request hace loadingService.show()
// y en finalize() siempre se hace hide().
// ------------------------------------------------------
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Antes de enviar la request
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Siempre se ejecuta: éxito o error
      loadingService.hide();
    })
  );
};
