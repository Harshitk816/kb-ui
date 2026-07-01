import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { Task } from './tasks.models';

type TaskDrawerTab = 'details' | 'comments' | 'activity';

@Component({
  selector: 'app-task-details-drawer',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/50"
        (click)="close.emit()"
      ></div>

      <div
        class="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl border border-(--border-default) bg-(--bg-surface) shadow-[var(--shadow-lg)] md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-none md:w-[460px] md:rounded-none md:border-l"
      >
        <div class="flex h-full flex-col">
          <div class="flex items-start justify-between gap-4 border-b border-(--border-default) px-5 py-4">
            <div class="min-w-0 flex-1">
              <div class="mb-2 flex items-center gap-2">
                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  [ngClass]="priorityClass"
                >
                  {{ task?.priority || 'low' }}
                </span>

                <span class="rounded-full bg-(--bg-surface-2) px-2 py-0.5 text-[11px] text-(--text-muted)">
                  {{ statusLabel }}
                </span>
              </div>

              <h2 class="text-base font-semibold text-(--text-primary) md:text-lg">
                {{ task?.title || 'Untitled task' }}
              </h2>

              @if (task?.dueDate) {
                <p class="mt-1 text-xs text-(--text-muted)">
                  Due {{ task.dueDate | date: 'dd MMM yyyy' }}
                </p>
              }
            </div>

            <button
              type="button"
              (click)="close.emit()"
              class="ui-transition rounded-md p-2 text-(--text-muted) hover:bg-(--bg-surface-2) hover:text-(--text-primary)"
            >
              ✕
            </button>
          </div>

          <div class="flex items-center gap-2 border-b border-(--border-default) px-4 py-3">
            @for (tab of tabs; track tab) {
              <button
                type="button"
                (click)="activeTab.set(tab)"
                class="ui-transition rounded-md px-3 py-1.5 text-sm"
                [ngClass]="
                  activeTab() === tab
                    ? 'bg-(--color-primary-soft) text-(--text-primary)'
                    : 'text-(--text-muted) hover:bg-(--bg-surface-2) hover:text-(--text-primary)'
                "
              >
                {{ tabLabel(tab) }}
              </button>
            }
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-4">
            @if (activeTab() === 'details') {
              <div class="space-y-5">
                <section>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                    Description
                  </p>

                  <div class="rounded-md border border-(--border-default) bg-(--bg-surface-2) p-4 text-sm text-(--text-secondary)">
                    {{ task?.description || 'No description added yet.' }}
                  </div>
                </section>

                <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="rounded-md border border-(--border-default) bg-(--bg-surface-2) p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                      Priority
                    </p>
                    <p class="mt-2 text-sm text-(--text-primary)">
                      {{ task?.priority || 'low' }}
                    </p>
                  </div>

                  <div class="rounded-md border border-(--border-default) bg-(--bg-surface-2) p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                      Status
                    </p>
                    <p class="mt-2 text-sm text-(--text-primary)">
                      {{ statusLabel }}
                    </p>
                  </div>
                </section>
              </div>
            }

            @if (activeTab() === 'comments') {
              <div class="rounded-md border border-dashed border-(--border-default) bg-(--bg-surface-2) p-6 text-center">
                <h3 class="text-sm font-medium text-(--text-primary)">Comments coming next</h3>
                <p class="mt-2 text-sm text-(--text-muted)">
                  This tab is ready for comment list, add, edit, and delete flows.
                </p>
              </div>
            }

            @if (activeTab() === 'activity') {
              <div class="rounded-md border border-dashed border-(--border-default) bg-(--bg-surface-2) p-6 text-center">
                <h3 class="text-sm font-medium text-(--text-primary)">Activity timeline coming next</h3>
                <p class="mt-2 text-sm text-(--text-muted)">
                  This tab is ready for task-specific backend activity log entries.
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TaskDetailsDrawerComponent {
  @Input({ required: true }) task!: Task | null;
  @Output() close = new EventEmitter<void>();

  tabs: TaskDrawerTab[] = ['details', 'comments', 'activity'];
  activeTab = signal<TaskDrawerTab>('details');

  tabLabel(tab: TaskDrawerTab) {
    switch (tab) {
      case 'details':
        return 'Details';
      case 'comments':
        return 'Comments';
      case 'activity':
        return 'Activity';
    }
  }

  get statusLabel() {
    const status = this.task?.taskStatus?.trim();
    if (!status) return 'todo';
    return status.replace(/_/g, ' ');
  }

  get priorityClass() {
    switch (this.task?.priority) {
      case 'urgent':
        return 'bg-red-500/15 text-red-400';
      case 'high':
        return 'bg-orange-500/15 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-400';
      default:
        return 'bg-slate-500/15 text-slate-300';
    }
  }
}