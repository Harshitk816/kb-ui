import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BoardsService } from './boards.service';

@Component({
  selector: 'app-create-board-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div
      class="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="animate-modal-in w-full max-w-md rounded-lg border border-(--border-default) bg-(--bg-surface) shadow-(--shadow-lg)"
      >
        <div
          class="flex items-start justify-between border-b border-(--border-default) px-6 py-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-(--text-primary)">
              Create Board
            </h2>
            <p class="mt-1 text-sm text-(--text-muted)">
              Add a new Kanban column to this project.
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
              Board name
            </label>
            <input
              [(ngModel)]="boardName"
              type="text"
              placeholder="Enter board name"
              class="ui-transition w-full rounded-sm border border-(--border-default) bg-(--bg-surface-2) px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--color-primary)"
            />
          </div>

          @if (boardsService.error()) {
            <p class="text-sm text-(--color-danger)">
              {{ boardsService.error() }}
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
            (click)="createBoard()"
            [disabled]="!boardName.trim() || boardsService.creating()"
            class="ui-transition rounded-sm bg-(--color-primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ boardsService.creating() ? 'Creating...' : 'Create Board' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CreateBoardModalComponent {
  @Input({ required: true }) projectId!: number;
  @Input({ required: true }) currentBoardCount!: number;

  @Output() close = new EventEmitter<void>();

  boardsService = inject(BoardsService);

  boardName = '';

  createBoard() {
    const name = this.boardName.trim();

    if (!name) return;

    this.boardsService.createBoard(
      {
        projectId: this.projectId,
        boardName: name,
        position: this.currentBoardCount + 1,
      },
      () => {
        this.boardName = '';
        this.close.emit();
      }
    );
  }
}