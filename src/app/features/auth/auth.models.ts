export interface UserApi {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  status: boolean | string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: UserApi;
    accessToken: string;
    refreshToken: string;
  };
}