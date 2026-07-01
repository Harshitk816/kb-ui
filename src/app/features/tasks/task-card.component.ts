import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';

import { Task } from './tasks.models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [NgClass, DatePipe],
  template: `
    <button
      type="button"
      class="ui-transition block w-full rounded-md border border-(--border-default) bg-(--bg-surface-2) p-3 text-left shadow-[var(--shadow-sm)] hover:bg-(--bg-surface-3)"
      (click)="open.emit(task)"
    >
      <div class="flex items-start justify-between gap-3">
        <h4 class="line-clamp-2 text-sm font-medium text-(--text-primary)">
          {{ task?.title || 'Untitled task' }}
        </h4>

        <span
          class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
          [ngClass]="priorityClass"
        >
          {{ task?.priority || 'low' }}
        </span>
      </div>

      @if (task?.description) {
        <p class="mt-2 line-clamp-2 text-xs text-(--text-muted)">
          {{ task.description }}
        </p>
      }

      <div class="mt-3 flex items-center justify-between gap-2">
        <span
          class="rounded-full bg-(--bg-surface) px-2 py-1 text-[11px] text-(--text-muted)"
        >
          {{ statusLabel }}
        </span>

        @if (task?.dueDate) {
          <span
            class="text-[11px]"
            [ngClass]="isOverdue ? 'text-(--color-danger)' : 'text-(--text-muted)'"
          >
            {{ task.dueDate | date: 'dd MMM' }}
          </span>
        }
      </div>
    </button>
  `,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() open = new EventEmitter<Task>();

  get isOverdue() {
    if (!this.task?.dueDate) return false;
    return new Date(this.task.dueDate).getTime() < Date.now();
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