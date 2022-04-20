import React from 'react';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl } from '@material-ui/core';
import {
  Box,
  MenuItem,
  Select,
  styled,
  TextField,
  FormLabel,
} from '@mui/material';
import * as Yup from 'yup';
import { OverlayPopup } from '../../components/OverlayPopup';
import { StyledMainButton } from '../../components/Popup/Popup.styled';

export const schema = Yup.object().shape({
  paymentDetails: Yup.string().required('Поле обязательное'),
  paymentMethod: Yup.string().required('Поле обязательное'),
});

export interface PaymentDetailsFormFormValues {
  paymentDetails: string;
  paymentMethod: string;
}

interface paymentMethodsProps{
  id: string,
  name: string
}

interface PaymentDetailsFormProps {
  detailsPaymentMethods: paymentMethodsProps[];
  onSubmit: SubmitHandler<PaymentDetailsFormFormValues>;
  onClose: () => void;
}

const PaymentDetailsForm = ({ onSubmit, onClose, detailsPaymentMethods}: PaymentDetailsFormProps) => {
  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  return (
    <OverlayPopup
      title="Реквизиты"
      onClose={onClose}
    >
      <FormProvider {...form}>
        <Box
          sx={{
            marginTop: {
              xs: '24px',
              md: '40px',
            }
          }}
        >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormControl fullWidth>
            <StyledFormLabel>
              Способ оплаты:
            </StyledFormLabel>
              <Select
                {...form.register("paymentMethod")}
                variant="standard"
                sx={{ marginTop: '12px' }}
              >
                  {detailsPaymentMethods.map((paymentMethod)=>(
                    <MenuItem value={paymentMethod.id}>
                      {paymentMethod.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
            >
              <StyledFormLabel>
                Номер карты:
                <TextField
                  {...form.register("paymentDetails")}
                  variant="standard"
                  fullWidth
                  inputProps={{ style: { marginTop: '12px' } }}
                />
              </StyledFormLabel>
            </FormControl>
            <Box mt="32px">
              <StyledMainButton type="submit">Отправить</StyledMainButton>
            </Box>
          </form>
        </Box>
      </FormProvider>
    </OverlayPopup>
  );
};

const StyledFormLabel = styled(FormLabel)`
  font-size: 14px;
  color: #8A8A8A;
`;

export { PaymentDetailsForm };
