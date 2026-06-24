import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ApiService } from '../../core/services/api.service';
import { TokenService } from '../../core/services/token.service';
import { LoginRequest, LoginResponse, UserApi } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private apiService = inject(ApiService);
    private tokenService = inject(TokenService);

    private currentUserSignal = signal<UserApi | null>(null);
    private isLoggedInSignal = signal<boolean>(this.tokenService.hasAccessToken());

    currentUser = this.currentUserSignal.asReadonly();
    isLoggedIn = computed(() => this.isLoggedInSignal());

    login(payload: LoginRequest) {
        return this.apiService.post<LoginResponse>('/users/login', payload).pipe(
        tap((response) => {
            this.tokenService.setAccessToken(response.data.accessToken);
            this.tokenService.setRefreshToken(response.data.refreshToken);
            this.currentUserSignal.set(response.data.user);
            this.isLoggedInSignal.set(true);
        })
        );
    }

    logout() {
        this.tokenService.clearTokens();
        this.currentUserSignal.set(null);
        this.isLoggedInSignal.set(false);
    }

    getAccessToken(): string | null {
        return this.tokenService.getAccessToken();
    }
}