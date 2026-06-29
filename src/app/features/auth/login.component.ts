import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div
      class="flex min-h-screen items-center justify-center bg-(--bg-app) p-6"
    >
      <div class="w-full max-w-md">

        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-primary-soft) text-xl font-bold text-(--color-primary)"
          >
            K
          </div>
          <h1 class="text-2xl font-semibold text-(--text-primary)">
            Welcome back
          </h1>
          <p class="mt-1 text-sm text-(--text-muted)">
            Sign in to your KanbanApp account
          </p>
        </div>

        <div
          class="rounded-xl border border-(--border-default) bg-(--bg-surface) p-6 shadow-(--shadow-md)"
        >
          <form class="space-y-4" (ngSubmit)="onLogin()">

            <div>
              <label
                class="mb-1.5 block text-sm font-medium text-(--text-secondary)"
              >
                Email
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="Enter your email"
                class="ui-transition w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-2.5 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
              />
            </div>

            <div>
              <label
                class="mb-1.5 block text-sm font-medium text-(--text-secondary)"
              >
                Password
              </label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password"
                class="ui-transition w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-2.5 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
              />
            </div>

            @if (error()) {
              <div
                class="rounded-md border border-(--color-danger) bg-(--bg-surface-2) px-3 py-2.5 text-sm text-(--color-danger)"
              >
                {{ error() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="loading()"
              class="ui-transition mt-2 w-full rounded-md bg-(--color-primary) px-4 py-2.5 text-sm font-medium text-white hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ loading() ? 'Signing in...' : 'Sign in' }}
            </button>

          </form>
        </div>

        <p class="mt-5 text-center text-sm text-(--text-muted)">
          Don't have an account?
          <a
            routerLink="/auth/register"
            class="ui-transition font-medium text-(--color-primary) hover:text-(--color-primary-hover)"
          >
            Create one
          </a>
        </p>

      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  onLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      this.error.set('Please enter your email and password.');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}