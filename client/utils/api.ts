import Axios, { AxiosError, AxiosResponse } from 'axios';

import getFinger from './get-finger';
import User from '~/types/user';
import Pagination from '~/types/pagination';


Axios.defaults.baseURL = 'http://localhost:3001/api';
Axios.defaults.withCredentials = true;

export interface SignInResultData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type SignInValidationError = AxiosError<{
  name: 'ValidationError';
  message: string;
  errors: {
    [key in 'email' | 'password']: {
      value: any;
      message: string;
    };
  }
}>;

export type SignInResult = AxiosResponse<SignInResultData>;

export const signIn = async (email: string, password: string) => {
  const fingerprint = await getFinger();

  return Axios.post<SignInResult>('/auth/sign-in', {
    email,
    password,
    fingerprint,
  });
};

export interface IdentificationResult {
  user: User | null;
}

export const identification = (cookies: any) => {
  return Axios.get<IdentificationResult>('/auth/identification', {
    headers: cookies ? {
      Cookie: cookies,
    } : {},
  });
};

export type GetUsersResult = Pagination<User>;

export const getUsers = (query?: string, count?: number) =>
  Axios.get<GetUsersResult>('/users', { params: { query, 'pagination[limit]': count } });
