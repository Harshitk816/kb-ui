import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TasksService } from './tasks.service';
import { TaskPriority, TaskStatus } from './tasks.models';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div
      class="animate-overlay-in fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
    >
      <div
        class="animate-modal-in w-full rounded-t-2xl border border-(--border-default) bg-(--bg-surface) shadow-[var(--shadow-lg)] sm:max-w-lg sm:rounded-xl"
      >
        <div class="flex items-start justify-between border-b border-(--border-default) px-6 py-4">
          <div>
            <h2 class="text-lg font-semibold text-(--text-primary)">Create Task</h2>
            <p class="mt-1 text-sm text-(--text-muted)">
              Add a new task to this board.
            </p>
          </div>

          <button
            (click)="close.emit()"
            class="ui-transition rounded-md p-2 text-(--text-muted) hover:bg-(--bg-surface-2) hover:text-(--text-primary)"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4 px-6 py-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Title
            </label>
            <input
              [(ngModel)]="title"
              type="text"
              placeholder="Enter task title"
              class="ui-transition w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-(--text-secondary)">
              Description
            </label>
            <textarea
              [(ngModel)]="description"
              rows="3"
              placeholder="Optional description"
              class="ui-transition w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                Priority
              </label>
              <select
                [(ngModel)]="priority"
                class="ui-transition w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--color-primary)"
              >
                @for (item of priorities; track item) {
                  <option [value]="item">{{ item }}</option>
                }
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-(--text-secondary)">
                Due date
              </label>
              <input
                [(ngModel)]="dueDate"
                type="date"
                class="ui-transition w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--color-primary)"
              />
            </div>
          </div>

          @if (tasksService.error()) {
            <p class="text-sm text-(--color-danger)">
              {{ tasksService.error() }}
            </p>
          }
        </div>

        <div class="flex justify-end gap-3 border-t border-(--border-default) px-6 py-4">
          <button
            (click)="close.emit()"
            class="ui-transition rounded-md border border-(--border-default) bg-(--bg-surface-2) px-4 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            Cancel
          </button>

          <button
            (click)="createTask()"
            [disabled]="!title.trim() || tasksService.creating()"
            class="ui-transition rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ tasksService.creating() ? 'Creating...' : 'Create Task' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateTaskModalComponent {
  @Input({ required: true }) projectId!: number;
  @Input({ required: true }) boardId!: number;
  @Input({ required: true }) currentTaskCount!: number;

  @Output() close = new EventEmitter<void>();

  tasksService = inject(TasksService);

  priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

  title = '';
  description = '';
  priority: TaskPriority = 'medium';
  dueDate = '';

  createTask() {
    const taskStatus: TaskStatus = 'todo';

    this.tasksService.createTask(
      {
        projectId: this.projectId,
        boardId: this.boardId,
        title: this.title.trim(),
        description: this.description.trim() || '',
        priority: this.priority,
        taskStatus,
        position: this.currentTaskCount + 1,
        dueDate: this.dueDate ? new Date(this.dueDate).toISOString() : null,
      },
      () => {
        this.title = '';
        this.description = '';
        this.priority = 'medium';
        this.dueDate = '';
        this.close.emit();
      }
    );
  }
}