export interface Board {
  id: number;
  projectId: number;
  boardName: string;
  position: number;
}

export interface GetBoardsResponse {
  success: boolean;
  data: Board[];
}

export interface CreateBoardRequest {
  projectId: number;
  boardName: string;
  position: number;
}

export interface CreateBoardResponse {
  success: boolean;
  message: string;
  data: Board;
}