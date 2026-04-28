import { apiRequest } from './client';
import {
  LoginFormValues,
  LoginResponse,
  MeResponse,
} from '../types/auth.types';

export function loginRequest(values: LoginFormValues) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: values,
  });
}

export function getMeRequest(token: string) {
  return apiRequest<MeResponse>('/auth/me', {
    method: 'GET',
    token,
  });
}
