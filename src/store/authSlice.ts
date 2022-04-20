import { createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState, AppThunk } from '.';
import { authService, RegisterRequestValuesType } from '../services/api/auth';
import { getMe } from './userSlice';

export type FieldErrorType = {
  name: string;
  message: string;
};
export interface IError {
  code: number;
  message: string;
  fields?: FieldErrorType[];
}

export interface AuthState {
  loading: boolean;
  registered: boolean;
  error?: IError | null;
  passwordRecoveryLinkSend: boolean;
  passwordRecoverySuccess: boolean;
  enable2faSuccess: boolean;
  disable2faSuccess: boolean;
  enable2faError: string | null;
  enable2faCode: string | null;
  redirectTo2fa: boolean;
  confirmEmail: boolean;
}

export type ParamsForEnable2faType = {
  username: string;
  code: string;
};

const initialState: AuthState = {
  loading: false,
  registered: false,
  error: null,
  passwordRecoveryLinkSend: false,
  passwordRecoverySuccess: false,
  enable2faSuccess: false,
  disable2faSuccess: false,
  enable2faError: null,
  enable2faCode: null,
  redirectTo2fa: false,
  confirmEmail: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setRegisteredSuccess: (state) => {
      state.registered = true;
    },
    setRegisteredFailed: (state) => {
      state.registered = false;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    setPasswordRecoveryLinkSend(state, { payload }) {
      state.passwordRecoveryLinkSend = payload;
    },
    setPasswordRecoverySuccess(state, { payload }) {
      state.passwordRecoverySuccess = payload;
    },
    setEnable2faSuccess(state, { payload }) {
      state.enable2faSuccess = payload;
    },
    setDisable2faSuccess(state, { payload }) {
      state.disable2faSuccess = payload;
    },
    setEnable2faError(state, { payload }) {
      state.enable2faError = payload;
    },
    setEnable2faCode(state, { payload }) {
      state.enable2faCode = payload;
    },
    setRedirectTo2fa(state, { payload }) {
      state.redirectTo2fa = payload;
    },
    setConfirmEmail(state, { payload }) {
      state.confirmEmail = payload;
    },
  },
});

export const {
  setLoading,
  setRegisteredSuccess,
  setRegisteredFailed,
  setError,
  setEnable2faError,
  setPasswordRecoveryLinkSend,
  setPasswordRecoverySuccess,
  setEnable2faSuccess,
  setDisable2faSuccess,
  setEnable2faCode,
  setRedirectTo2fa,
  setConfirmEmail,
} = authSlice.actions;

export const register =
  ({ email, password, referralCode }: RegisterRequestValuesType): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setError(null));
      dispatch(setRegisteredFailed());
      dispatch(setLoading(true));
      await authService.register({ email, password, referralCode });
      dispatch(setRegisteredSuccess());
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        dispatch(
          setError({
            code: err.response.data.code,
            message: err.response.data.message,
          })
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getPasswordRecoveryLink =
  (login: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setPasswordRecoveryLinkSend(false));
      dispatch(setError(null));
      dispatch(setLoading(true));
      await authService.getPasswordRecoveryLink(login);
      dispatch(setPasswordRecoveryLinkSend(true));
    } catch (err) {
      // const { response }: any = err;
      // dispatch(
      //   setError({
      //     code: response?.data.code,
      //     message: response?.data.message,
      //   })
      // );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const postNewPassword =
  ({
    code,
    newPassword,
    userName,
  }: {
    code: string;
    newPassword: string;
    userName?: string;
  }): AppThunk =>
  async (dispatch, getState) => {
    try {
      const login = userName || getState().user.user?.login || '';
      dispatch(setPasswordRecoverySuccess(false));
      dispatch(setError(null));
      dispatch(setLoading(true));
      await authService.postNewPassword({ login, code, newPassword });
      dispatch(setPasswordRecoverySuccess(true));
    } catch (err) {
      const { response }: any = err;
      dispatch(
        setError({
          code: response.data.code,
          message: response.data.message,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const get2faCode = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setError(null));
    dispatch(setEnable2faError(null));
    dispatch(setLoading(true));
    const { data } = await authService.get2faCode();
    dispatch(setEnable2faCode(data.key));
  } catch (err) {
    const { response }: any = err;
    dispatch(
      setError({
        code: response.data.code,
        message: response.data.message,
      })
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const enable2fa =
  (params: ParamsForEnable2faType): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await authService.enable2fa(params);
      dispatch(getMe());
      dispatch(setEnable2faSuccess(true));
    } catch (err) {
      const { response }: any = err;
      dispatch(setEnable2faError(response.data.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const disable2fa = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await authService.disable2fa();
    dispatch(getMe());
    dispatch(setDisable2faSuccess(true));
  } catch (err) {
    const { response }: any = err;
    dispatch(
      setError({
        code: response.data.code,
        message: response.data.message,
      })
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const confirmEmail =
  (token: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await authService.confirmEmail(token);
      dispatch(setConfirmEmail(true));
    } catch (err) {
      const { response }: any = err;
      dispatch(
        setError({
          code: response?.data?.code,
          message: response?.data?.message,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const selectIsLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;
export const selectSuccessRegistered = (state: RootState) =>
  state.auth.registered;

export const selectPasswordRecoveryLinkSend = (state: RootState) =>
  state.auth.passwordRecoveryLinkSend;
export const selectPasswordRecoverySuccess = (state: RootState) =>
  state.auth.passwordRecoverySuccess;

export const selectEnable2faSuccess = (state: RootState) =>
  state.auth.enable2faSuccess;
export const selectDisable2faSuccess = (state: RootState) =>
  state.auth.disable2faSuccess;
export const selectEnable2faError = (state: RootState) =>
  state.auth.enable2faError;
export const selectEnable2faCode = (state: RootState) =>
  state.auth.enable2faCode;
export const selectRedirectTo2fa = (state: RootState) =>
  state.auth.redirectTo2fa;
export const select2faCode = (state: RootState) => state.auth.enable2faCode;
export const selectConfirmEmail = (state: RootState) => state.auth.confirmEmail;

export default authSlice.reducer;
