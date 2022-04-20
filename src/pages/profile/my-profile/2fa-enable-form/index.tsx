/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import PartitionedInput from '../../../../components/PartitionedInput/partitioned-input';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import useAppSelector from '../../../../hooks/useAppSelector';
import {
  enable2fa,
  get2faCode,
  selectEnable2faCode,
  selectEnable2faError,
  selectEnable2faSuccess,
  selectIsLoading,
  setEnable2faError,
  setEnable2faSuccess,
} from '../../../../store/authSlice';
import { selectUser } from '../../../../store/userSlice';
import usePopup from '../../../../hooks/usePopup';
import {
  Box,
  styled,
  CircularProgress,
  TextField,
} from '@mui/material';
import { OverlayPopup } from '../../../../components/OverlayPopup';

const TwoFactorEnableForm = () => {
  const dispatch = useAppDispatch();
  const [verificationCode, setVerificationCode] = useState<string>();
  const enable2faCode = useAppSelector(selectEnable2faCode);
  const enable2faSuccess = useAppSelector(selectEnable2faSuccess);
  const loading = useAppSelector(selectIsLoading);
  const user = useAppSelector(selectUser);
  //const enable2faError = useAppSelector(selectEnable2faError);
  const { setPopup } = usePopup();

  useEffect(() => {
    return () => {
      dispatch(setEnable2faError(null));
      dispatch(setEnable2faSuccess(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (enable2faSuccess) {
      setPopup(
        <OverlayPopup
          onClose={() => {
            setPopup(null);
          }}
        >
          <Box
            mt="40px"
            display="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            flexDirection="column"
          >
            <b>Двухфакторная аутентификация успешно подключена!</b>
            <Box mt="24px">
              Используйте полученный в приложении Google Authenticator
              {' '}код при последующей авторизации
            </Box>
          </Box>
        </OverlayPopup>
      );
    }
  }, [enable2faSuccess]);

  useEffect(() => {
    dispatch(get2faCode());
  }, []);

  useEffect(() => {
    if (verificationCode?.length === 6 && user?.login) {
      dispatch(enable2fa({ username: user.login, code: verificationCode }));
      setVerificationCode('');
    }
  }, [verificationCode]);

  const passVerificationCode = (code: string) => {
    setVerificationCode(code);
  };

  const getNew2faCode = () => {
    dispatch(get2faCode());
  };

  // const showEnable2faError = () => {
  //   if (enable2faError) {
  //     if (enable2faError === '2fa expired or never asked or not valid') {
  //       return <div> Неверный код! пожалуйста, повторите снова</div>;
  //     } else if (enable2faError === "Second step of 2fa didn't expect") {
  //       return (
  //         <div>
  //           Текущий QR-код устарел! для продолжения получите
  //           <a onClick={getNew2faCode} href="#">
  //             {' '}
  //             новый
  //           </a>{' '}
  //           и отсканируйте его снова
  //         </div>
  //       );
  //     }
  //   }
  //   return null;
  // };

  return (
    <Box>
      {loading ? (
        <LoadingLayout>
          <CircularProgress />
        </LoadingLayout>
      ) : (
        <Box mt="40px">
          <Box mb="10px">
            1. Загрузите на Ваш телефон приложение
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ru&gl=US"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px',
                textDecoration: 'none',
              }}
            >
              Google Authenticator
            </a>
          </Box>
          <Box mb="10px">
            2. Используйте Google Authenticator, чтобы сканировать QR-код
          </Box>

          {enable2faCode && (
            <Box mb="10px">
              <Box textAlign="center" mb="10px">
                <QRCode
                  value={`otpauth://totp/Goldenbit?secret=${enable2faCode}`}
                  size={150}
                />
              </Box>
              <TextField value={enable2faCode} disabled fullWidth />
            </Box>
          )}

          <Box mb="10px">
            3. Введите сгенерированный приложением код, чтобы подтвердить
            подключение
          </Box>

          <Box display="flex" justifyContent="center">
            <PartitionedInput
              value={verificationCode}
              onValueChange={(value) => passVerificationCode(value)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const LoadingLayout = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
`;

export default TwoFactorEnableForm;
