/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  FormControl,
  styled,
} from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import { FormField } from '../../components/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router';
import Recaptcha from 'react-recaptcha';
import { ErrorPopup } from '../../components/ErrorPopup';
import usePopup from '../../hooks/usePopup';
import { LoginFormSchema } from '../../constants/validators';

interface FormValues {
  password: string;
  email: string;
  code: string;
}

const LoginForm = () => {
  const {
    loading,
    loginCredentials,
    login2fa,
    redirectTo2fa,
    error,
    setError,
  } = useAuth();

  const { setPopup } = usePopup();
  const history = useHistory();
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(LoginFormSchema),
  });

  useEffect(() => {
    let registerCredentials: string | null;

    /**
     * Проверяем, если пользователь зарегистрировался и требуется его авторизовать
     */
    if (
      (registerCredentials = localStorage.getItem('register_credentials')) !==
      null
    ) {
      try {
        const credentials: {
          email: string;
          password: string;
        } = JSON.parse(registerCredentials);
        form.setValue('email', credentials.email);
        form.setValue('password', credentials.password);

        /**
         * Удаляем данные регистрации
         */
        localStorage.removeItem('register_credentials');
      } catch (err) {}
    }
  }, []);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setError(null);
            setPopup(null);
          }}
          errorMessage={error}
        />
      );
    }
  }, [error]);

  const onSubmit: SubmitHandler<FormValues> = ({
    email,
    password,
    code,
  }: FormValues) => {
    if (redirectTo2fa) {
      login2fa(email, code);
    } else {
      loginCredentials(email, password);
    }
  };

  const reCaptchaVerifyCallback = useCallback(() => {
    // TODO: connect reCaptcha
  }, []);

  return (
    <FormProvider {...form}>
      <Box
        mb="40px"
        fontSize="36px"
        fontWeight="bold"
        sx={{
          textAlign: {
            sm: 'left',
            lg: 'left',
          },
        }}
      >
        Вход
      </Box>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormControl fullWidth>
          {redirectTo2fa ? (
            <FormField
              label="Введите код от Google authenticator"
              name="code"
            />
          ) : (
            <>
              <FormField label="E-mail" name="email" type="text" />
              <FormField label="Пароль" name="password" type="password" />
            </>
          )}

          {process.env.MODE === 'prod' && (
            <Box m="40px">
              <Recaptcha
                sitekey="xxxxxxxxxxxxxxxxxxxx"
                render="explicit"
                verifyCallback={reCaptchaVerifyCallback}
              />
            </Box>
          )}
          <StyledLink
            onClick={() => history.push('/login/recovery')}
            sx={{
              padding: {
                lg: '0',
              },
              backgroundColor: {
                lg: '#ffffff',
              },
              borderRadius: {
                sm: '36px',
                lg: '0',
              },
              alignItems: {
                sm: 'left',
                lg: 'flex-start',
              },
              fontSize: '14px'
            }}
          >
            Забыли пароль?
          </StyledLink>

          <Box mt="20px">
            <StyledSubmitButton type="submit" disabled={loading}>
              {loading ? 'Подождите...' : 'Войти'}
            </StyledSubmitButton>
            <StyledLink
              onClick={() => history.push('/login/register')}
              textAlign="center"
              mt="20px">
              Зарегистрироваться
            </StyledLink>

            {redirectTo2fa && (
              <StyledLink
                onClick={() => history.push('/login')}
                textAlign="center"
              >
                Отмена
              </StyledLink>
            )}
          </Box>
        </FormControl>
      </form>
    </FormProvider>
  );
};

const StyledLink = styled(Box)`
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
`;

const StyledSubmitButton = styled(ButtonUnstyled)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  border-radius: 36px;
  width: 100%;
  border: 0;
  padding: 15px 0;
`;

export default LoginForm;
