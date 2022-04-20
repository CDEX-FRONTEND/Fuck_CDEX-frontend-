import { createContext } from 'react';
import { LoginState } from './AuthProvider';

export interface IAuthContext {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  loginState: 'wait' | 'logged' | 'not logged';
  token?: string;
  setToken: (token: string) => void;
  setLoginState: (loginState: LoginState) => void;
  login: Function;
  logout: Function;
  loginCredentials: Function;
  login2fa: Function;
  error?: string;
  setError: Function;
  redirectTo2fa: boolean;
  loading: boolean;
}

const AuthContext = createContext<IAuthContext>({
  authenticated: false,
  setAuthenticated: (authenticated: boolean) => {},
  loginState: 'wait',
  redirectTo2fa: false,
  loading: false,
  setToken(token: string) {},
  setLoginState(loginState: LoginState) {},
  login() {},
  logout() {},
  loginCredentials(email: string, password: string) {},
  login2fa(email: string, code: string) {},
  setError(error: string) {},
});

export { AuthContext };
