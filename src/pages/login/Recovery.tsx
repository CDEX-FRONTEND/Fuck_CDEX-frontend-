/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PasswordRecoveryFormSchema } from '../../constants/validators';
import {
  Box,
  FormControl,
  styled,
  TextField,
} from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import {
  getPasswordRecoveryLink,
  postNewPassword,
  selectIsLoading,
  selectPasswordRecoveryLinkSend,
  selectPasswordRecoverySuccess,
  setError,
  setPasswordRecoveryLinkSend,
  setPasswordRecoverySuccess,
} from '../../store/authSlice';
import { FormField } from '../../components/FormField';
import useAppSelector from '../../hooks/useAppSelector';
import { useHistory } from 'react-router';
import { SuccessPopup } from '../../components/SuccessPopup';
import usePopup from '../../hooks/usePopup';

export interface RecoveryPasswordFormValues {
  code: string;
  newPassword: string;
  userName?: string;
}

const RecoveryForm = () => {
  const history = useHistory();
  const { setPopup } = usePopup();
  const [userName, setUserName] = useState('');
  const dispatch = useAppDispatch();
  const isPasswordRecoveryLinkSend = useAppSelector(
    selectPasswordRecoveryLinkSend
  );
  const isPasswordRecoverySuccess = useAppSelector(
    selectPasswordRecoverySuccess
  );
  const loading = useAppSelector(selectIsLoading);
  const successRecoveryPassword = useAppSelector(selectPasswordRecoverySuccess);

  useEffect(() => {
    return () => {
      dispatch(setPasswordRecoveryLinkSend(false));
      dispatch(setPasswordRecoverySuccess(false));
      dispatch(setError(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (isPasswordRecoverySuccess) {
      history.push('/login');
    }
  }, [isPasswordRecoverySuccess]);

  useEffect(() => {
    if (successRecoveryPassword) {
      setPopup(
        <SuccessPopup
          onClose={() => setPopup(null)}
          message='Ваш пароль успешно изменен!'
        />
      );
    }
  }, [successRecoveryPassword]);

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(PasswordRecoveryFormSchema),
  });

  const onRecoveryDataSubmit: SubmitHandler<RecoveryPasswordFormValues> = ({
    code,
    newPassword,
  }: RecoveryPasswordFormValues) => {
    dispatch(postNewPassword({ code, newPassword, userName }));
  };

  const onCancel = useCallback(() => {
    history.push('/login');
  }, []);

  return (
    <FormProvider {...form}>
      <Box>
        
        {!isPasswordRecoveryLinkSend && (
          <>
            <Box
              fontWeight="bold"
              mb="20px"
              sx={{
                textAlign: {
                  sm: 'center',
                  md: 'left',
                },
                fontSize: {
                  sm: '18px',
                  md: '36px'
                }
              }}
            >
              Сброс пароля
            </Box>

            <TextField
              name="email"
              fullWidth
              label="Е-mail"
              onChange={(event) => setUserName(event.target.value)}
              value={userName}
              variant="standard"
            />

            <Box mt="20px">
              <StyledSubmitButton
                type="submit"
                disabled={!!(loading || !userName)}
                onClick={() => {
                  dispatch(getPasswordRecoveryLink(userName));
                }}
              >
                {loading ? 'Подождите...' : 'Далее'}
              </StyledSubmitButton>
            </Box>
            <Box mt="20px">
              <StyledLink textAlign="center" onClick={onCancel}>
                Отмена
              </StyledLink>
            </Box>
          </>
        )}

        {isPasswordRecoveryLinkSend && (
          <>
            <Box
              fontWeight="bold"
              mb="20px"
              sx={{
                textAlign: {
                  sm: 'center',
                  md: 'left',
                },
                fontSize: {
                  sm: '18px',
                  md: '36px'
                }
              }}
            >
              На Вашу почту был отправлен код для смены пароля
            </Box>
            <form onSubmit={form.handleSubmit(onRecoveryDataSubmit)}>
              <FormControl fullWidth>
                <FormField label="Код" name="code" />
                <FormField
                  label="Новый пароль"
                  name="newPassword"
                  type="password"
                />
                <FormField
                  label="Повторите новый пароль"
                  name="confirmNewPassword"
                  type="password"
                />
                <StyledSubmitButton type="submit" disabled={loading}>
                  {loading ? 'Подождите...' : 'Отправить'}
                </StyledSubmitButton>
                <Box mt="20px">
                  <StyledLink textAlign="center" onClick={onCancel}>
                    Отмена
                  </StyledLink>
                </Box>
              </FormControl>
            </form>
          </>
        )}
      </Box>
    </FormProvider>
  );
};

const StyledSubmitButton = styled(ButtonUnstyled)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  border-radius: 36px;
  border: 0;
  width: 100%;
  padding: 15px 0;
`;

const StyledLink = styled(Box)`
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
`;

export default RecoveryForm;
