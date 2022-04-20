import React, { useCallback, useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterFormSchema } from '../../constants/validators';
import {
  FormControl,
  Checkbox,
  Box,
  styled,
  Typography,
} from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import {
  register,
  selectIsLoading,
  selectSuccessRegistered,
  setError,
  setRegisteredFailed,
} from '../../store/authSlice';
import { FormField } from '../../components/FormField';
import useAppSelector from '../../hooks/useAppSelector';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ErrorPopup } from '../../components/ErrorPopup';
import usePopup from '../../hooks/usePopup';
import { useQuery } from '../../hooks/useQuery';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

const RegistrationForm = () => {
  const history = useHistory();
  const { setPopup } = usePopup();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector((state) => state.auth.error);
  const successRegistered = useAppSelector(selectSuccessRegistered);
  const [checked, setChecked] = React.useState<boolean>(false);
  const agreementIsChecked = () => {
    setChecked((prev) => !prev);
  };

  const query = useQuery();
  const referral = query.get('referral')

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(RegisterFormSchema),
  });
  useEffect(() => {
    dispatch(setError(null));
  }, []);

  useEffect(() => {
    if (successRegistered) {
      // setPopup(
      //   <OverlayPopup onClose={() => setPopup(null)}>
      //     <Box textAlign="center">Регистрация прошла успешно!</Box>
      //     <Box textAlign="center">
      //       Ссылка активации отправлена на вашу почту.
      //     </Box>
      //   </OverlayPopup>
      // );

      // setTimeout(() => setPopup(null), 2500);

      history.push('/login');
      dispatch(setRegisteredFailed());
    }
  }, [successRegistered]);

  const onSubmit = useCallback(
    ({ email, password, referralCode }: FormValues) => {
      localStorage.setItem(
        'register_credentials',
        JSON.stringify({
          email,
          password,
        })
      );

      if (referral) {
        dispatch(
          register({
            email,
            password,
            referralCode: referral,
          })
        );
      } else {
        dispatch(
          register({
            email,
            password,
          })
        );
      }
    },
    [referral]
  );

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            dispatch(setError(null));
            setPopup(null);
          }}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  return (
    <FormProvider {...form}>
      <Box
        mb="40px"
        fontSize="36px"
        fontWeight="bold"
        sx={{
          textAlign: {
            xs: 'center',
            md: 'left',
          },
        }}
      >
        Регистрация
      </Box>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormControl fullWidth>
          <FormField label="Email" name="email" />
          <FormField label="Пароль" name="password" type="password" />
          <FormField
            label="Повторите пароль"
            name="confirmPassword"
            type="password"
          />

          <Box color="#d9d9d9" fontSize="12px">
            Пароль должен содержать хотя бы одну цифру, одну прописную букву и
            одну строчную букву и быть не менее 8 символов.
          </Box>

          <Box display="flex" my="20px">
            <Box>
              <Checkbox checked={checked} onChange={agreementIsChecked} />
            </Box>
            <Box ml="10px" fontSize="12px">
              Регистрируясь на сайте, Вы принимаете
              <Link to="/agreements">Правила пользования сайтом </Link>,
              соглашаетесь с условиями{' '}
              <Link to="/agreements?tab=4">Пользовательского соглашения </Link>и{' '}
              <Link to="/agreements">Политикой конфиденциальности </Link>.
            </Box>
          </Box>

          <StyledSubmitButton type="submit" disabled={!checked || loading}>
            {loading ? 'Подождите...' : 'Зарегистрироваться'}
          </StyledSubmitButton>
          <Box mt="20px">
            <StyledLink textAlign="center" onClick={() => history.push('/')}>
              Отмена
            </StyledLink>
          </Box>
        </FormControl>
      </form>
    </FormProvider>
  );
};

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

const StyledLink = styled(Box)`
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
`;

export default RegistrationForm;
