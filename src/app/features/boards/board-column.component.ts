import { Component, Input, signal } from '@angular/core';

import { Board } from './boards.models';
import { Task } from '../tasks/tasks.models';
import { TaskCardComponent } from '../tasks/task-card.component';
import { CreateTaskModalComponent } from '../tasks/create-task-modal.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [TaskCardComponent, CreateTaskModalComponent],
  template: `
    <div
      class="flex w-full shrink-0 flex-col rounded-lg border border-(--border-default) bg-(--bg-surface) shadow-[var(--shadow-sm)] md:w-80"
    >
      <div class="flex items-center justify-between border-b border-(--border-default) px-4 py-3">
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-semibold text-(--text-primary)">
            {{ board.boardName }}
          </h3>
        </div>

        <span
          class="ml-2 shrink-0 rounded-full bg-(--bg-surface-2) px-2 py-0.5 text-xs text-(--text-muted)"
        >
          {{ tasks.length }}
        </span>
      </div>

      <div class="flex items-center justify-between px-4 py-3">
        <p class="text-xs text-(--text-muted)">Board tasks</p>

        <button
          (click)="isCreateTaskOpen.set(true)"
          class="ui-transition rounded-md bg-(--bg-surface-2) px-2.5 py-1.5 text-xs text-(--text-secondary) hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
        >
          + Add Task
        </button>
      </div>

      <div class="flex-1 space-y-3 p-3">
        @if (loading) {
          @for (item of [1, 2]; track item) {
            <div class="h-28 animate-pulse rounded-md bg-(--bg-surface-2)"></div>
          }
        } @else if (tasks.length === 0) {
          <div
            class="flex min-h-32 items-center justify-center rounded-md border border-dashed border-(--border-default) bg-(--bg-surface-2) px-4 py-6 text-center text-sm text-(--text-muted)"
          >
            No tasks yet
          </div>
        } @else {
          @for (task of tasks; track task.id) {
            <app-task-card [task]="task" />
          }
        }
      </div>

      @if (isCreateTaskOpen() && projectId) {
        <app-create-task-modal
          [projectId]="projectId"
          [boardId]="board.id"
          [currentTaskCount]="tasks.length"
          (close)="isCreateTaskOpen.set(false)"
        />
      }
    </div>
  `,
})
export class BoardColumnComponent {
  @Input({ required: true }) board!: Board;
  @Input({ required: true }) projectId!: number;
  @Input() tasks: Task[] = [];
  @Input() loading = false;

  isCreateTaskOpen = signal(false);
}