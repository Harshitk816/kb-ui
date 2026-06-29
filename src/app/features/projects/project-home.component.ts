import { Component, effect, inject } from '@angular/core';

import { ProjectsService } from './projects.service';
import { BoardsService } from '../boards/boards.service';
import { BoardColumnComponent } from '../boards/board-column.component';
import { CreateBoardModalComponent } from '../boards/create-board-modal.component';
import { TasksService } from '../tasks/tasks.service';

@Component({
  selector: 'app-project-home',
  standalone: true,
  imports: [BoardColumnComponent, CreateBoardModalComponent],
  template: `
    <div class="flex h-full flex-col">
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3 md:mb-6">
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-xl font-semibold text-(--text-primary) md:text-2xl">
            {{ projectsService.activeProject()?.projectName || 'Project Workspace' }}
          </h1>
          <p class="mt-1 text-sm text-(--text-muted)">
            {{
              projectsService.activeProject()?.description ||
              'Manage your boards and tasks here.'
            }}
          </p>
        </div>

        <button
          (click)="isCreateBoardOpen = true"
          class="ui-transition shrink-0 rounded-md bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-white hover:bg-(--color-primary-hover)"
        >
          + New Board
        </button>
      </div>

      @if (boardsService.error()) {
        <div
          class="mb-4 rounded-md border border-(--color-danger) bg-(--bg-surface) px-4 py-3 text-sm text-(--color-danger)"
        >
          {{ boardsService.error() }}
        </div>
      }

      @if (tasksService.error()) {
        <div
          class="mb-4 rounded-md border border-(--color-danger) bg-(--bg-surface) px-4 py-3 text-sm text-(--color-danger)"
        >
          {{ tasksService.error() }}
        </div>
      }

      @if (boardsService.loading()) {
        <div class="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:pb-2">
          @for (item of [1, 2, 3]; track item) {
            <div
              class="h-64 w-full shrink-0 animate-pulse rounded-lg bg-(--bg-surface) md:h-70 md:w-80"
            ></div>
          }
        </div>
      } @else if (boardsService.boards().length === 0) {
        <div
          class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-(--border-default) bg-(--bg-surface) p-8"
        >
          <div class="max-w-xs text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--bg-surface-2) text-2xl">
              📋
            </div>
            <h2 class="text-base font-semibold text-(--text-primary)">
              No boards yet
            </h2>
            <p class="mt-2 text-sm text-(--text-muted)">
              Create your first board to start organizing work into columns.
            </p>
            <button
              (click)="isCreateBoardOpen = true"
              class="ui-transition mt-4 rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-primary-hover)"
            >
              Create First Board
            </button>
          </div>
        </div>
      } @else {
        <div class="flex flex-col gap-4 pb-2 md:flex-row md:overflow-x-auto">
          @for (board of boardsService.boards(); track board.id) {
            <app-board-column
              [board]="board"
              [projectId]="projectsService.activeProjectId()!"
              [tasks]="tasksService.tasksForBoard(board.id)()"
              [loading]="tasksService.isBoardLoading(board.id)()"
            />
          }
        </div>
      }

      @if (isCreateBoardOpen && projectsService.activeProjectId()) {
        <app-create-board-modal
          [projectId]="projectsService.activeProjectId()!"
          [currentBoardCount]="boardsService.boards().length"
          (close)="isCreateBoardOpen = false"
        />
      }
    </div>
  `,
})
export class ProjectHomeComponent {
  projectsService = inject(ProjectsService);
  boardsService = inject(BoardsService);
  tasksService = inject(TasksService);

  isCreateBoardOpen = false;

  constructor() {
    effect(() => {
      const projectId = this.projectsService.activeProjectId();

      if (projectId) {
        this.boardsService.loadBoards(projectId);
        this.tasksService.clearTasks();
      } else {
        this.boardsService.clearBoards();
        this.tasksService.clearTasks();
      }
    });

    effect(() => {
      const boards = this.boardsService.boards();

      for (const board of boards) {
        if (!this.tasksService.hasLoadedBoard(board.id)()) {
        this.tasksService.loadTasksByBoard(board.id);
        }
    }
    });
  }
}