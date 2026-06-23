import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  template: `
    <div class="min-h-screen bg-slate-50 p-6">
      <h1 class="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p class="mt-2 text-sm text-slate-600">
        Main app placeholder. Projects and Kanban workspace will come later.
      </p>
    </div>
  `,
})
export class DashboardPageComponent {}