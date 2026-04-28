import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthUser } from '../types/auth.types';
import { deleteAuthToken, getAuthToken, saveAuthToken } from './tokenStorage';
import { getMeRequest } from '../api/auth.api';

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await getAuthToken();

        if (!storedToken) {
          return;
        }

        const response = await getMeRequest(storedToken);

        setToken(storedToken);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to restore auth session', error);
      } finally {
        setIsAuthLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  const signIn = useCallback(async (nextToken: string, nextUser: AuthUser) => {
    await saveAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    await deleteAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAuthLoading,
      signIn,
      signOut,
    }),
    [token, user, isAuthLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
