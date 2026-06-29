import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header
      class="flex h-14 shrink-0 items-center justify-between border-b border-(--border-default) bg-(--bg-surface) px-3 md:px-4"
    >
      <!-- Left: hamburger + logo -->
      <div class="flex items-center gap-2 md:gap-3">

        <!-- Hamburger — mobile only -->
        <button
          (click)="menuToggle.emit()"
          class="ui-transition flex h-9 w-9 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--bg-surface-2) hover:text-(--text-primary) lg:hidden"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--color-primary-soft) text-sm font-bold text-(--color-primary)"
        >
          K
        </div>

        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-(--text-primary)">KanbanApp</p>
          <p class="text-xs text-(--text-muted)">Task management</p>
        </div>
      </div>

      <!-- Right: actions + user -->
      <div class="flex items-center gap-2 md:gap-3">

        <button
          (click)="createProject.emit()"
          class="ui-transition rounded-md bg-(--color-primary) px-2.5 py-1.5 text-xs font-medium text-white hover:bg-(--color-primary-hover) sm:px-3 sm:text-sm"
        >
          <span class="hidden sm:inline">+ New Project</span>
          <span class="sm:hidden">+</span>
        </button>

        <div
          class="hidden items-center gap-2 rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-1.5 md:flex"
        >
          <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-3) text-xs font-semibold text-(--text-primary)"
          >
            {{ (authService.currentUser()?.username || authService.currentUser()?.email || 'U').charAt(0).toUpperCase() }}
          </div>
          <span class="max-w-32 truncate text-sm text-(--text-secondary)">
            {{ authService.currentUser()?.username || authService.currentUser()?.email }}
          </span>
        </div>

        <button
          (click)="logout()"
          class="ui-transition rounded-md border border-(--border-default) bg-(--bg-surface-2) px-2.5 py-1.5 text-xs text-(--text-secondary) hover:bg-(--bg-surface-3) hover:text-(--text-primary) sm:px-3 sm:text-sm"
        >
          Logout
        </button>

      </div>
    </header>
  `,
})
export class TopbarComponent {
  @Output() createProject = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<void>();

  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}