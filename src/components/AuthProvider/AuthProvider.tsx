import React, { FC, useState } from 'react';
import { httpClient } from '../../services/httpClient';
import { AuthContext } from './AuthContext';
import { userService } from '../../services/api/user';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getMe, setUser } from '../../store/userSlice';
import { authService } from '../../services/api/auth';
import axios from 'axios';

interface IAuthProviderProps {
  children: React.ReactChild;
}

export type LoginState = 'wait' | 'logged' | 'not logged';

const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [loginState, setLoginState] = useState<LoginState>('wait');
  const [error, setError] = useState<string>();
  const [redirectTo2fa, setRedirectTo2fa] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        token,
        loginState,
        error,
        redirectTo2fa,
        loading,
        setToken(token: string) {
          setToken(token);
          httpClient.setToken(token);
        },
        setLoginState,
        async login() {
          try {
            const response = await userService.getMe();
            if (response.status === 200) {
              setAuthenticated(true);

              dispatch(setUser(response.data));
              setLoginState('logged');
            } else {
              setLoginState('not logged');
            }
          } catch (err) {
            console.log(err);
            setLoginState('not logged');
          }
        },
        logout() {
          httpClient.setToken(null);
          localStorage.removeItem('token');
          setAuthenticated(false);
          setLoginState('not logged');
        },
        async loginCredentials(username: string, password: string) {
          try {
            const response = await authService.login({
              username,
              password,
            });

            if (response.status === 201 && response.data.token) {
              localStorage.setItem('token', response.data.token);
              setAuthenticated(true);
              setToken(response.data.token);

              httpClient.setToken(response.data.token);

              dispatch(getMe());
            } else if (response.data.redirectTo) {
              setRedirectTo2fa(true);
            }
          } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
              setError(err.response.data.message)
            }
          }
        },
        async login2fa(username: string, code: string) {
          try {
            const response = await authService.login2fa({
              username,
              code,
            });

            if (response.status === 201) {
              if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setAuthenticated(true);
                setToken(response.data.token);

                httpClient.setToken(response.data.token);

                setRedirectTo2fa(false);
              } else {
                setError(response.data.messageL);
              }
            }
          } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
              setError(err.response.data.message)
            }
          }
        },
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
