import axios from 'axios';
import type { User, CreateUserDto } from '@repo/types';

export const createApiClient = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    users: {
      getAll: async (): Promise<User[]> => {
        const { data } = await api.get('/users');
        return data;
      },
      create: async (userData: CreateUserDto): Promise<User> => {
        const { data } = await api.post('/users', userData);
        return data;
      },
    },
  };
};
