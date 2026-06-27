import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

const PUBLIC_URLS = ['/users/login', '/users/register', '/users/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const isPublic = PUBLIC_URLS.some((url) => req.url.includes(url));

    if (isPublic) {
        return next(req);
    }

     const token = tokenService.getAccessToken();

     if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
        Authorization: `Bearer ${token}`,
        },
    });

    return next(authReq);
}