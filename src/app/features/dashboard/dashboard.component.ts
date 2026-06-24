import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="min-h-screen bg-slate-50 p-6">
      <h1 class="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p class="mt-2 text-sm text-slate-600">
        Logged in: {{ authService.isLoggedIn() ? 'Yes' : 'No' }}
      </p>

      <button
        class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white"
        (click)="logout()"
      >
        Logout
      </button>
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}