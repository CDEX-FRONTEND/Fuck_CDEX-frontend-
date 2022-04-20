/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Button, styled } from '@mui/material';
import { ButtonUnstyled } from '@mui/base';
import React, { useEffect } from 'react';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import useAppSelector from '../../../../hooks/useAppSelector';
import {
  disable2fa,
  selectDisable2faSuccess,
  selectIsLoading,
  setDisable2faSuccess,
} from '../../../../store/authSlice';
import { StyledMainButton } from '../../../../components/Popup/Popup.styled';

const TwoFactorDisableForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectIsLoading);
  const isDisablesd2faSuccess = useAppSelector(selectDisable2faSuccess);

  useEffect(() => {
    return () => {
      dispatch(setDisable2faSuccess(false));
    };
  }, [dispatch]);

  const onDisable2fa = () => {
    dispatch(disable2fa());
  };

  return (
    <Box
      sx={{
        marginTop: {
          xs: '24px',
          md: '40px'
        }
      }}
    >
      {isDisablesd2faSuccess ? (
        <Box>Двухфакторная аутентификация успешно отключена!</Box>
      ) : (
        <Box>
          Вы уверены, что хотите отключить двухфакторную аутентификацию?
          <Box
            sx={{
              marginTop: {
                xs: '24px',
                md: '40px'
              }
            }}
          >
            <StyledMainButton
              disabled={loading}
              onClick={onDisable2fa}
            >
              {loading ? 'Подождите...' : 'Отключить'}
            </StyledMainButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TwoFactorDisableForm;
