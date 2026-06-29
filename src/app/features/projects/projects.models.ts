export interface Project {
  id: number;
  projectName: string;
  description: string | null;
}

export interface GetProjectsResponse {
  success: boolean;
  data: Project[];
}

export interface CreateProjectRequest {
  projectName: string;
  description?: string;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

