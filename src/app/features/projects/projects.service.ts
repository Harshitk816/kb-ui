import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectsResponse,
  Project,
} from './projects.models';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  creating: boolean;
  error: string;
  activeProjectId: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private state = signal<ProjectsState>({
    projects: [],
    loading: false,
    creating: false,
    error: '',
    activeProjectId: null,
  });

  readonly projects = computed(() => this.state().projects);
  readonly loading = computed(() => this.state().loading);
  readonly creating = computed(() => this.state().creating);
  readonly error = computed(() => this.state().error);
  readonly activeProjectId = computed(() => this.state().activeProjectId);
  readonly activeProject = computed(() =>
    this.state().projects.find(
        (project) => project.id === this.state().activeProjectId
    ) || null
    );

  loadProjects() {
    this.state.update((state) => ({
      ...state,
      loading: true,
      error: '',
    }));

    this.apiService.get<GetProjectsResponse>('/projects').subscribe({
      next: (response) => {
        this.state.update((state) => ({
          ...state,
          projects: response.data || [],
          loading: false,
        }));
      },
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: err?.error?.message || 'Failed to load projects',
        }));
      },
    });
  }

  createProject(payload: CreateProjectRequest, onSuccess?: () => void) {
    this.state.update((state) => ({
      ...state,
      creating: true,
      error: '',
    }));

    this.apiService.post<CreateProjectResponse>('/projects', payload).subscribe({
      next: (response) => {
        const newProject = response.data;

        this.state.update((state) => ({
          ...state,
          creating: false,
          projects: [newProject, ...state.projects],
          activeProjectId: newProject.id,
        }));

        onSuccess?.();
        this.router.navigateByUrl(`/projects/${newProject.id}`);
      },
      error: (err) => {
        this.state.update((state) => ({
          ...state,
          creating: false,
          error: err?.error?.message || 'Failed to create project',
        }));
      },
    });
  }

  selectProject(projectId: number) {
    this.state.update((state) => ({
      ...state,
      activeProjectId: projectId,
    }));

    this.router.navigateByUrl(`/projects/${projectId}`);
  }

  setActiveProjectId(projectId: number | null) {
    this.state.update((state) => ({
      ...state,
      activeProjectId: projectId,
    }));
  }
  
}