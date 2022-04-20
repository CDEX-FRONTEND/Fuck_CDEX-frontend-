import * as Yup from 'yup';

const EMAIL_VALIDATOR = Yup.string()
  .required('Почта обязательная')
  .matches(
    /^[a-z0-9_\-.@]{1,}$/i,
    'Почта может содержать только символы [a-zA-Z0-9_-.]'
  )
  .email('Неверная почта');

export const PASSWORD_VALIDATOR = Yup.string()
  .required('Пароль обязательный')
  .min(1, 'Пароль должен быть не менее 1 символов');

export const REGISTER_PASSWORD_VALIDATOR = Yup.string()
  .required('Поле обязательное')
  .min(8, 'Пароль должен быть не менее 8 символов')
  .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
  .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
  .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру');

export const LoginFormSchema = Yup.object().shape({
  password: PASSWORD_VALIDATOR,
  email: EMAIL_VALIDATOR,
});

export const RegisterFormSchema = Yup.object().shape({
  email: EMAIL_VALIDATOR,
  password: REGISTER_PASSWORD_VALIDATOR,
  confirmPassword: Yup.string()
    .required('Поле обязательное')
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать'),
});

export const AdvertisementFormSchema = Yup.object().shape({
  volume: Yup.number()
    .typeError('Обязательное числовое поле')
    .max(Yup.ref('volumeMax'), 'Больше максимальной суммы'),

  volumeMax: Yup.number()
    .typeError('Обязательное числовое поле')
    .min((Yup.ref('volume')), 'Меньше минимальной суммы'),

  factor: Yup.number()
  .required('Поле обязательное')
  .typeError('Поле обязательное'),

  side: Yup.string(),
  paymentMethodId: Yup.string(),
  description: Yup.string(),
  privateMode: Yup.string(),
});

export const PasswordRecoveryFormSchema = Yup.object().shape({
  code: Yup.string().required('Поле обязательное'),
  newPassword: REGISTER_PASSWORD_VALIDATOR,
  confirmNewPassword: Yup.string()
    .required('Поле обязательное')
    .oneOf([Yup.ref('newPassword')], 'Пароли должны совпадать'),
});

export const ChangeNameFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Поле обязательное')
    .matches(
      /^[a-z0-9_\-.]{1,}$/i,
      'Никнейм может содержать только символы [a-zA-Z0-9_-.]'
    )
    .min(5, 'Не менее 5 символов'),
});
