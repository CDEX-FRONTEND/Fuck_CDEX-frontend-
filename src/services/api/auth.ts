import { ParamsForEnable2faType } from '../../store/authSlice';
import { httpClient } from '../httpClient';

export type LoginRequestValuesType = {
  username: string;
  password: string;
};

export type Login2faRequestValuesType = {
  username: string;
  code: string;
};

export type RegisterRequestValuesType = {
  email: string;
  password: string;
  referralCode?: string;
};

export type PostPhoneConfirmationCodeRequestValuesType = {
  code: string;
};

export type PostNewPasswordRequestValuesType = {
  login: string;
  code: string;
  newPassword: string;
};

export const authService = {
  login(requestValues: LoginRequestValuesType) {
    return httpClient.post('/api/v1/auth/login', requestValues);
  },
  register(requestValues: RegisterRequestValuesType) {
    return httpClient.post('/api/v1/auth/register', requestValues);
  },
  logout() {
    return httpClient.post('/api/v1/auth/logout');
  },
  getPhoneConfirmationCode() {
    return httpClient.get('/api/v1/auth/phone-confirmation');
  },
  postPhoneConfirmationCode(
    requestValues: PostPhoneConfirmationCodeRequestValuesType
  ) {
    return httpClient.post('/api/v1/auth/phone-confirmation', requestValues);
  },
  getPasswordRecoveryLink(login: string) {
    return httpClient.get('/api/v1/auth/password-recovery', {
      params: { login },
    });
  },
  postNewPassword(requestValues: PostNewPasswordRequestValuesType) {
    return httpClient.post('/api/v1/auth/password-recovery', requestValues);
  },
  get2faCode() {
    return httpClient.get('/api/v1/auth/2fa/get-key');
  },
  enable2fa(params: ParamsForEnable2faType) {
    return httpClient.post('/api/v1/auth/2fa/enable', params);
  },
  disable2fa() {
    return httpClient.get('/api/v1/auth/2fa/disable');
  },

  login2fa(requestValues: Login2faRequestValuesType) {
    return httpClient.post('/api/v1/auth/2fa', requestValues);
  },
  getSumsubToken() {
    return httpClient.get('/api/v1/auth/sumsub-token');
  },
  confirmEmail(token: string) {
    return httpClient.get('/api/v1/auth/email-confirmation', {
      params: { token },
    });
  },
};
