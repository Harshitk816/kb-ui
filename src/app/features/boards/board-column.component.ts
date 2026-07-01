import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

import { Board } from './boards.models';
import { Task } from '../tasks/tasks.models';
import { TaskCardComponent } from '../tasks/task-card.component';
import { CreateTaskModalComponent } from '../tasks/create-task-modal.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    TaskCardComponent,
    CreateTaskModalComponent,
  ],
  styles: [`
    .cdk-drag-preview {
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      opacity: 0.95;
      border-radius: 6px;
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cdk-drop-list-dragging .task-card-wrap:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cdk-drop-list-receiving {
      background: color-mix(in oklch, var(--color-primary) 6%, var(--bg-surface));
      border-radius: 8px;
    }
  `],
  template: `
    <div
      class="flex w-full shrink-0 flex-col rounded-lg border border-(--border-default) bg-(--bg-surface) shadow-[var(--shadow-sm)] md:w-80"
    >
      <!-- Column header -->
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

      <!-- Subheader + Add Task -->
      <div class="flex items-center justify-between px-4 py-2">
        <p class="text-xs text-(--text-muted)">
          {{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }}
        </p>

        <button
          (click)="isCreateTaskOpen.set(true)"
          class="ui-transition rounded-md bg-(--bg-surface-2) px-2.5 py-1.5 text-xs text-(--text-secondary) hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
        >
          + Add Task
        </button>
      </div>

      <!-- Drop zone -->
      <div
        cdkDropList
        [id]="dropListId"
        [cdkDropListData]="tasks"
        [cdkDropListConnectedTo]="connectedDropListIds"
        (cdkDropListDropped)="onDrop($event)"
        class="min-h-32 flex-1 space-y-3 p-3 transition-colors duration-200"
      >
        @if (loading) {
          @for (item of [1, 2]; track item) {
            <div class="h-28 animate-pulse rounded-md bg-(--bg-surface-2)"></div>
          }
        } @else if (tasks.length === 0) {
          <div
            class="flex min-h-32 items-center justify-center rounded-md border border-dashed border-(--border-default) bg-(--bg-surface-2) px-4 py-6 text-center text-sm text-(--text-muted)"
          >
            Drop tasks here
          </div>
        } @else {
          @for (task of tasks; track task.id) {
            <div cdkDrag [cdkDragData]="task" class="task-card-wrap">
              <app-task-card [task]="task" />

              <!-- Drag placeholder -->
              <div
                *cdkDragPlaceholder
                class="h-28 rounded-md border-2 border-dashed border-(--color-primary) bg-(--color-primary-soft) opacity-60"
              ></div>
            </div>
          }
        }
      </div>
    </div>

    @if (isCreateTaskOpen() && projectId) {
      <app-create-task-modal
        [projectId]="projectId"
        [boardId]="board.id"
        [currentTaskCount]="tasks.length"
        (close)="isCreateTaskOpen.set(false)"
      />
    }
  `,
})
export class BoardColumnComponent {
  @Input({ required: true }) board!: Board;
  @Input({ required: true }) projectId!: number;
  @Input() tasks: Task[] = [];
  @Input() loading = false;
  @Input() connectedDropListIds: string[] = [];

  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();

  isCreateTaskOpen = signal(false);

  get dropListId() {
    return `board-drop-${this.board.id}`;
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    this.taskDropped.emit(event);
  }
}