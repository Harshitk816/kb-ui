import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class TokenService {

    private accessTokenKey = 'accessToken';
    private refreshTokenKey = 'refreshToken';

    setAccessToken(token: string) {
        localStorage.setItem(this.accessTokenKey, token);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    setRefreshToken(token: string) {
        localStorage.setItem(this.refreshTokenKey, token);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    clearTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    hasAccessToken(): boolean {
        return !!this.getAccessToken();
    }

}