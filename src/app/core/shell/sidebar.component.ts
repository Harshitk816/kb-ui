import { Component, EventEmitter, Output, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ProjectsService } from '../../features/projects/projects.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass],
  template: `
    <aside
      class="flex h-full w-64 flex-col border-r border-(--border-default) bg-(--bg-surface)"
    >
      <div class="flex items-center justify-between px-4 pt-5 pb-3">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
          Projects
        </p>

        <!-- Close button — mobile only -->
        <button
          (click)="close.emit()"
          class="ui-transition flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--bg-surface-2) hover:text-(--text-primary) lg:hidden"
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-2 pb-4">
        @if (projectsService.loading()) {
          <div class="space-y-2">
            @for (item of [1,2,3]; track item) {
              <div class="h-11 animate-pulse rounded-md bg-(--bg-surface-2)"></div>
            }
          </div>
        } @else if (projectsService.projects().length === 0) {
          <div
            class="rounded-md border border-dashed border-(--border-default) bg-(--bg-surface-2) px-3 py-4 text-sm italic text-(--text-muted)"
          >
            No projects yet
          </div>
        } @else {
          <div class="space-y-1">
            @for (project of projectsService.projects(); track project.id) {
              <button
                (click)="selectProject(project.id)"
                class="ui-transition w-full rounded-md border px-3 py-2.5 text-left"
                [ngClass]="
                  projectsService.activeProjectId() === project.id
                    ? 'border-(--color-primary) bg-(--color-primary-soft) text-(--text-primary)'
                    : 'border-transparent text-(--text-secondary) hover:border-(--border-default) hover:bg-(--bg-surface-2) hover:text-(--text-primary)'
                "
              >
                <div class="truncate text-sm font-medium">
                  {{ project.projectName }}
                </div>

                @if (project.description) {
                  <div
                    class="mt-1 truncate text-xs"
                    [ngClass]="
                      projectsService.activeProjectId() === project.id
                        ? 'text-(--text-secondary)'
                        : 'text-(--text-muted)'
                    "
                  >
                    {{ project.description }}
                  </div>
                }
              </button>
            }
          </div>
        }
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  @Output() close = new EventEmitter<void>();

  projectsService = inject(ProjectsService);
  private router = inject(Router);

  constructor() {
    this.projectsService.loadProjects();
    this.syncFromUrl(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncFromUrl(event.urlAfterRedirects);
        this.close.emit();
      });
  }

  selectProject(projectId: number) {
    this.projectsService.selectProject(projectId);
  }

  private syncFromUrl(url: string) {
    const match = url.match(/\/projects\/(\d+)/);
    const projectId = match ? Number(match[1]) : null;
    this.projectsService.setActiveProjectId(projectId);
  }
}