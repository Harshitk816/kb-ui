import { Injectable, computed, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  GetTasksResponse,
  MoveTaskDto,
  MoveTaskResponse,
  Task,
} from './tasks.models';

interface TasksState {
  tasksByBoardId: Record<number, Task[]>;
  loadingBoardIds: number[];
  creating: boolean;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiService = inject(ApiService);

  private state = signal<TasksState>({
    tasksByBoardId: {},
    loadingBoardIds: [],
    creating: false,
    error: '',
  });

  readonly creating = computed(() => this.state().creating);
  readonly error = computed(() => this.state().error);

  hasLoadedBoard(boardId: number) {
    return computed(() => boardId in this.state().tasksByBoardId);
  }

  tasksForBoard(boardId: number) {
    return computed(() =>
      [...(this.state().tasksByBoardId[boardId] || [])].sort((a, b) => a.position - b.position),
    );
  }

  isBoardLoading(boardId: number) {
    return computed(() => this.state().loadingBoardIds.includes(boardId));
  }

  loadTasksByBoard(boardId: number) {
    this.state.update((state) => ({
      ...state,
      loadingBoardIds: [...new Set([...state.loadingBoardIds, boardId])],
      error: '',
    }));

    this.apiService.get<GetTasksResponse>(`/tasks/board/${boardId}`).subscribe({
      next: (response) => {
        this.state.update((state) => ({
          ...state,
          tasksByBoardId: {
            ...state.tasksByBoardId,
            [boardId]: response.data || [],
          },
          loadingBoardIds: state.loadingBoardIds.filter((id) => id !== boardId),
        }));
      },
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          loadingBoardIds: state.loadingBoardIds.filter((id) => id !== boardId),
          error: err?.error?.message || 'Failed to load tasks',
        }));
      },
    });
  }

  createTask(payload: CreateTaskRequest, onSuccess?: () => void) {
    this.state.update((state) => ({
      ...state,
      creating: true,
      error: '',
    }));

    this.apiService.post<CreateTaskResponse>('/tasks', payload).subscribe({
      next: (response) => {
        const newTask = response.data;
        const currentBoardTasks = this.state().tasksByBoardId[newTask.boardId] || [];

        this.state.update((state) => ({
          ...state,
          creating: false,
          tasksByBoardId: {
            ...state.tasksByBoardId,
            [newTask.boardId]: [...currentBoardTasks, newTask],
          },
        }));

        onSuccess?.();
      },
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          creating: false,
          error: err?.error?.message || 'Failed to create task',
        }));
      },
    });
  }

  updateTaskLocally(taskId: number, patch: Partial<Task>) {
    const byBoard = { ...this.state().tasksByBoardId };

    for (const boardId in byBoard) {
      const idx = byBoard[boardId].findIndex((t) => t.id === taskId);

      if (idx !== -1) {
        byBoard[boardId] = [...byBoard[boardId]];
        byBoard[boardId][idx] = this.normalizeTask({
          ...byBoard[boardId][idx],
          ...patch,
        });
        break;
      }
    }

    this.state.update((state) => ({ ...state, tasksByBoardId: byBoard }));
  }

  snapshotTasks(): Record<number, Task[]> {
    return JSON.parse(JSON.stringify(this.state().tasksByBoardId));
  }

  restoreSnapshot(snapshot: Record<number, Task[]>) {
    this.state.update((state) => ({
      ...state,
      tasksByBoardId: snapshot,
    }));
  }

  setTasksForBoard(boardId: number, tasks: Task[]) {
    this.state.update((state) => ({
      ...state,
      tasksByBoardId: {
        ...state.tasksByBoardId,
        [boardId]: tasks.map((t) => this.normalizeTask(t)),
      },
    }));
  }

  clearTasks() {
    this.state.set({
      tasksByBoardId: {},
      loadingBoardIds: [],
      creating: false,
      error: '',
    });
  }

  private normalizeTask(task: Task): Task {
    return {
      ...task,
      title: task.title?.trim() || 'Untitled task',
      description: task.description || '',
      priority: task.priority || 'low',
      taskStatus: task.taskStatus || 'todo',
      position: task.position ?? 0,
      dueDate: task.dueDate || null,
    };
  }

  moveTask(taskId: number, payload: MoveTaskDto) {
    return this.apiService.patch<MoveTaskResponse>(`/tasks/${taskId}/move`, payload);
  }

  
}