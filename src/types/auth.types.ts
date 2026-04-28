export type LoginFormValues = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'internal' | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  data: {
    token: string;
    user: AuthUser;
  };
};

export type MeResponse = {
  data: AuthUser;
};
