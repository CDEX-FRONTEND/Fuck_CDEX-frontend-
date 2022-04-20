import React, { FC } from 'react';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeNameFormSchema } from '../../constants/validators';
import { FormControl } from '@material-ui/core';
import { selectIsLoading } from '../../store/authSlice';
import { FormField } from '../../components/FormField';
import { postName } from '../../store/userSlice';
import { Box } from '@mui/material';
import { StyledMainButton } from '../../components/Popup/Popup.styled';

export interface ChangeNameFormValues {
  name: string;
}

const ChangeNameForm: FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(ChangeNameFormSchema),
  });

  const onSubmit: SubmitHandler<ChangeNameFormValues> = ({
    name,
  }: ChangeNameFormValues) => {
    dispatch(postName(name));
  };

  return (
    <FormProvider {...form}>
      <Box
        sx={{
          marginTop: {
            xs: '24px',
            md: '40px',
          },
        }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <FormField label="Введите никнейм" name="name" type="text" />
          </FormControl>
          <Box mt="10px" color="#ff0000">
            Снова изменить никнейм вы сможете через 3 месяца. Будьте уверенны
            что хотите именно его.
          </Box>

          <Box mt="10px">
            <StyledMainButton type="submit" disabled={loading}>
              {loading ? 'Подождите...' : 'Создать'}
            </StyledMainButton>
          </Box>
        </form>
      </Box>
    </FormProvider>
  );
};

export default ChangeNameForm;
