import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 class="text-2xl font-semibold text-slate-900">Login</h1>
        <form class="mt-6 space-y-4" (ngSubmit)="onLogin()">

          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Enter email"
              >
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              placeholder="Enter password"
            />
          </div>

          @if (error()) {
              <p class="text-sm text-red-600">{{ error() }}</p>
            }

            <button
              type="submit"
              class="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Login
            </button>
        </form>
      </div>
    </div>`
})

export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');

  

  onLogin(){
    this.error.set('');

    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Login failed');
      },
    });
  }
}