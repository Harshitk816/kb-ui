import { Component, computed, effect, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ProjectsService } from './projects.service';
import { BoardsService } from '../boards/boards.service';
import { BoardColumnComponent } from '../boards/board-column.component';
import { CreateBoardModalComponent } from '../boards/create-board-modal.component';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/tasks.models';
import { TaskDetailsDrawerComponent } from '../tasks/task-details-drawer.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-home',
  standalone: true,
  imports: [
    BoardColumnComponent,
    CreateBoardModalComponent,
    TaskDetailsDrawerComponent,
  ],
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
        <div class="mb-4 rounded-md border border-(--color-danger) bg-(--bg-surface) px-4 py-3 text-sm text-(--color-danger)">
          {{ boardsService.error() }}
        </div>
      }

      @if (tasksService.error()) {
        <div class="mb-4 rounded-md border border-(--color-danger) bg-(--bg-surface) px-4 py-3 text-sm text-(--color-danger)">
          {{ tasksService.error() }}
        </div>
      }

      @if (boardsService.loading()) {
        <div class="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:pb-2">
          @for (item of [1, 2, 3]; track item) {
            <div class="h-64 w-full shrink-0 animate-pulse rounded-lg bg-(--bg-surface) md:h-70 md:w-80"></div>
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
            <h2 class="text-base font-semibold text-(--text-primary)">No boards yet</h2>
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
              [connectedDropListIds]="connectedDropListIds()"
              (taskDropped)="onTaskDropped($event)"
              (taskOpen)="openTask($event)"
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

      @if (selectedTask()) {
        <app-task-details-drawer
          [task]="selectedTask()"
          (close)="closeTaskDrawer()"
        />
      }
    </div>
  `,
})
export class ProjectHomeComponent {
  projectsService = inject(ProjectsService);
  boardsService = inject(BoardsService);
  tasksService = inject(TasksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  isCreateBoardOpen = false;

  connectedDropListIds = computed(() =>
    this.boardsService.boards().map((b) => `board-drop-${b.id}`)
  );

  selectedTaskId = computed(() => {
    const value = this.queryParams().get('taskId');
    return value ? Number(value) : null;
  });

  selectedTask = computed(() => {
    const taskId = this.selectedTaskId();
    if (!taskId) return null;

    for (const board of this.boardsService.boards()) {
      const found = this.tasksService.tasksForBoard(board.id)().find(
        (task) => task.id === taskId
      );
      if (found) return found;
    }

    return null;
  });

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

  openTask(task: Task) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { taskId: task.id },
      queryParamsHandling: 'merge',
    });
  }

  closeTaskDrawer() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { taskId: null },
      queryParamsHandling: 'merge',
    });
  }

  onTaskDropped(event: CdkDragDrop<Task[]>) {
    const task: Task = event.item.data;
    const fromBoardId = this.getBoardIdFromDropListId(event.previousContainer.id);
    const toBoardId = this.getBoardIdFromDropListId(event.container.id);
    const newIndex = event.currentIndex;
    const isSameBoard = event.previousContainer === event.container;

    if (isSameBoard && event.previousIndex === newIndex) return;

    const snapshot = this.tasksService.snapshotTasks();

    if (isSameBoard) {
      const tasks = [...this.tasksService.tasksForBoard(fromBoardId)()];
      moveItemInArray(tasks, event.previousIndex, newIndex);
      this.tasksService.setTasksForBoard(fromBoardId, tasks);
      const movedTask = tasks[newIndex];
      this.persistMove(movedTask.id, fromBoardId, newIndex + 1, snapshot);
    } else {
      const fromTasks = [...this.tasksService.tasksForBoard(fromBoardId)()];
      const toTasks = [...this.tasksService.tasksForBoard(toBoardId)()];
      transferArrayItem(fromTasks, toTasks, event.previousIndex, newIndex);
      this.tasksService.setTasksForBoard(fromBoardId, fromTasks);
      this.tasksService.setTasksForBoard(toBoardId, toTasks);
      const movedTask = toTasks[newIndex];
      this.persistMove(movedTask.id, toBoardId, newIndex + 1, snapshot);
    }
  }

  private persistMove(
    taskId: number,
    boardId: number,
    position: number,
    snapshot: Record<number, Task[]>
  ) {
    this.tasksService.moveTask(taskId, { boardId, position }).subscribe({
      error: () => {
        this.tasksService.restoreSnapshot(snapshot);
      },
    });
  }

  private getBoardIdFromDropListId(dropListId: string): number {
    return Number(dropListId.replace('board-drop-', ''));
  }
}