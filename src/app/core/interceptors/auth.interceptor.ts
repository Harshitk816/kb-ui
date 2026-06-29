import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { TokenService } from '../services/token.service';
import { ApiService } from '../services/api.service';

const PUBLIC_URLS = ['/users/login', '/users/register', '/users/refresh'];

interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const apiService = inject(ApiService);
  const router = inject(Router);

  const isPublic = PUBLIC_URLS.some((url) => req.url.includes(url));

  if (isPublic) {
    return next(req);
  }

  const token = tokenService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle 401 errors, pass everything else through
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.getRefreshToken();

      // No refresh token available — logout and redirect
      if (!refreshToken) {
        tokenService.clearTokens();
        router.navigateByUrl('/auth/login');
        return throwError(() => error);
      }

      // Try to get a new access token
      return apiService.post<RefreshResponse>('/users/refresh', { refreshToken }).pipe(
        switchMap((response) => {
          // Save new tokens
          tokenService.setAccessToken(response.data.accessToken);
          if (response.data.refreshToken) {
            tokenService.setRefreshToken(response.data.refreshToken);
          }

          // Retry original request with new token
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          // Refresh also failed — logout and redirect
          tokenService.clearTokens();
          router.navigateByUrl('/auth/login');
          return throwError(() => refreshError);
        })
      );
    })
  );
};