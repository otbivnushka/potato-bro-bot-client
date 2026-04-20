import { Api } from '@/services/api-client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AuthContextType {
  token: string;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    savedToken ? setToken(savedToken) : setToken(null);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    await Api.auth
      .login({ username, password })
      .then((response) => {
        localStorage.setItem('token', response.accessToken);
        setToken(response.accessToken);
      })
      .catch((err) => {
        throw err;
      });
  };

  const register = async (username: string, password: string) => {
    await Api.auth
      .registration({ username, password })
      .then((response) => {
        localStorage.setItem('token', response.accessToken);
        setToken(response.accessToken);
      })
      .catch((err) => {
        throw err;
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token: token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
