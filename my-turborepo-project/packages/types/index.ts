export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
