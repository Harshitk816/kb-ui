import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';
import { CreateProjectModalComponent } from '../../features/projects/create-project-modal.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, CreateProjectModalComponent],
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-app)">

      <app-topbar
        (createProject)="isCreateProjectOpen = true"
        (menuToggle)="isSidebarOpen.set(!isSidebarOpen())"
      />

      <div class="relative flex flex-1 overflow-hidden">

        <!-- Mobile overlay backdrop -->
        @if (isSidebarOpen()) {
          <div
            class="animate-overlay-in fixed inset-0 z-20 bg-black/60 lg:hidden"
            (click)="isSidebarOpen.set(false)"
          ></div>
        }

        <!-- Sidebar -->
        <div
          class="animate-drawer-in fixed inset-y-0 left-0 z-30 pt-14 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:block lg:translate-x-0 lg:pt-0"
          [class.-translate-x-full]="!isSidebarOpen()"
          [class.translate-x-0]="isSidebarOpen()"
        >
          <app-sidebar (close)="isSidebarOpen.set(false)" />
        </div>

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <router-outlet />
        </main>

      </div>

      @if (isCreateProjectOpen) {
        <app-create-project-modal (close)="isCreateProjectOpen = false" />
      }

    </div>
  `,
})
export class ShellComponent {
  isSidebarOpen = signal(false);
  isCreateProjectOpen = false;
}