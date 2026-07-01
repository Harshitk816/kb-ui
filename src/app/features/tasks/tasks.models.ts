export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | string;

export interface Task {
  id: number;
  projectId: number;
  boardId: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  taskStatus: TaskStatus;
  position: number;
  dueDate: string | null;
}

export interface GetTasksResponse {
  success: boolean;
  data: Task[];
}

export interface CreateTaskRequest {
  projectId: number;
  boardId: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  taskStatus: TaskStatus;
  position: number;
  dueDate?: string | null;
}

export interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface MoveTaskDto {
  boardId: number;
  position: number;
}

export interface MoveTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}