import { Injectable, computed, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import {
  Board,
  CreateBoardRequest,
  CreateBoardResponse,
  GetBoardsResponse,
} from './boards.models';

interface BoardsState {
  boards: Board[];
  loading: boolean;
  creating: boolean;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private apiService = inject(ApiService);

  private state = signal<BoardsState>({
    boards: [],
    loading: false,
    creating: false,
    error: '',
  });

  readonly boards = computed(() =>
    [...this.state().boards].sort((a, b) => a.position - b.position)
  );
  readonly loading = computed(() => this.state().loading);
  readonly creating = computed(() => this.state().creating);
  readonly error = computed(() => this.state().error);

  loadBoards(projectId: number) {
    this.state.update((state) => ({
      ...state,
      loading: true,
      error: '',
      boards: [],
    }));

    this.apiService
      .get<GetBoardsResponse>(`/boards/project/${projectId}`)
      .subscribe({
        next: (response) => {
          this.state.update((state) => ({
            ...state,
            boards: response.data || [],
            loading: false,
          }));
        },
        error: (err) => {
          this.state.update((state) => ({
            ...state,
            loading: false,
            error: err?.error?.message || 'Failed to load boards',
          }));
        },
      });
  }

  createBoard(payload: CreateBoardRequest, onSuccess?: () => void) {
    this.state.update((state) => ({
      ...state,
      creating: true,
      error: '',
    }));

    this.apiService.post<CreateBoardResponse>('/boards', payload).subscribe({
      next: (response) => {
        const newBoard = response.data;

        this.state.update((state) => ({
          ...state,
          creating: false,
          boards: [...state.boards, newBoard],
        }));

        onSuccess?.();
      },
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          creating: false,
          error: err?.error?.message || 'Failed to create board',
        }));
      },
    });
  }

  clearBoards() {
    this.state.set({
      boards: [],
      loading: false,
      creating: false,
      error: '',
    });
  }
}