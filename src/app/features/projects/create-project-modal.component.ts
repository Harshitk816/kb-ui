import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div
      class="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="animate-modal-in w-full max-w-lg rounded-lg border border-(--border-default) bg-(--bg-surface) shadow-(--shadow-lg"
      >
        <div
          class="flex items-start justify-between border-b border-(--border-default) px-6 py-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-(--text-primary)">
              Create Project
            </h2>
            <p class="mt-1 text-sm text-(--text-muted)">
              Start a new workspace for boards and tasks.
            </p>
          </div>

          <button
            (click)="close.emit()"
            class="ui-transition rounded-sm p-2 text-(--text-muted) hover:bg-(--bg-surface-2) hover:text-(--text-primary)"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4 px-6 py-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Project name
            </label>
            <input
              [(ngModel)]="projectName"
              type="text"
              placeholder="Enter project name"
              class="ui-transition w-full rounded-sm border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Description
            </label>
            <textarea
              [(ngModel)]="description"
              rows="4"
              placeholder="Optional description"
              class="ui-transition w-full rounded-sm border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
            ></textarea>
          </div>

          @if (projectsService.error()) {
            <p class="text-sm text-(--color-danger)">
              {{ projectsService.error() }}
            </p>
          }
        </div>

        <div
          class="flex justify-end gap-3 border-t border-(--border-default) px-6 py-4"
        >
          <button
            (click)="close.emit()"
            class="ui-transition rounded-sm border border-(--border-default) bg-(--bg-surface-2) px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            Cancel
          </button>

          <button
            (click)="createProject()"
            [disabled]="!projectName.trim() || projectsService.creating()"
            class="ui-transition rounded-sm bg-(--color-primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ projectsService.creating() ? 'Creating...' : 'Create Project' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateProjectModalComponent {
  @Output() close = new EventEmitter<void>();

  projectsService = inject(ProjectsService);

  projectName = '';
  description = '';

  createProject() {
    const name = this.projectName.trim();

    if (!name) return;

    this.projectsService.createProject(
      {
        projectName: name,
        description: this.description.trim() || '',
      },
      () => {
        this.projectName = '';
        this.description = '';
        this.close.emit();
      }
    );
  }
}