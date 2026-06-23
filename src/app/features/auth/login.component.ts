import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 class="text-2xl font-semibold text-slate-900">Login</h1>
        <p class="mt-2 text-sm text-slate-600">Login page placeholder</p>
      </div>
    </div>
  `,
})
export class LoginPageComponent {}