import React, { useRef, useEffect, useCallback } from 'react';
import {
  selectSuccessNameChanged,
  selectUser,
  setNameChanged,
  selectError as selectUserError,
  setError as setUserError,
} from '../../../store/userSlice';
import useAppSelector from '../../../hooks/useAppSelector';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getPasswordRecoveryLink } from '../../../store/authSlice';
import snsWebSdk from '@sumsub/websdk';
import Overlay from '../../../components/Overlay';
import Popup from '../../../components/Popup';
import { SuccessPopup } from '../../../components/SuccessPopup';
import { ErrorPopup } from '../../../components/ErrorPopup';
import { authService } from '../../../services/api/auth';
import ChangeNameForm from '../ChangeNameForm';
import NickNameIcon from '../../../icons/NickNameIcon.svg';
import PasswordIcon from '../../../icons/PasswordIcon.svg';
import TelegramIcon from '../../../icons/TelegramIcon.svg';
import GoogleIcon from '../../../icons/GoogleIcon.svg';
import ConfirmationIcon from '../../../icons/ConfirmationIcon.svg';
//import PhoneIcon from '../../../icons/PhoneIcon.svg';
import usePopup from '../../../hooks/usePopup';
import TwoFactorEnableForm from './2fa-enable-form';
import TwoFactorDisableForm from './2fa-disable-form';
import { Box } from '@mui/material';
import {
  PopupInfo, ProfileItem,
  ProfileItemDescription, ProfileItemInfo,
  ProfileItemTitle, StyledBorderedButton
}
  from './MyProfile.styled';


export default function MyProfile() {
  const dispatch = useAppDispatch();
  const iframeDiv = useRef(null);
  const { setPopup } = usePopup();
  const userAccount = useAppSelector(selectUser);
  const successNameChanged = useAppSelector(selectSuccessNameChanged);
  const userError = useAppSelector(selectUserError);
  //const loading = useAppSelector(selectIsLoading);

  useEffect(() => {
    return () => {
      dispatch(setUserError(null));
      dispatch(setNameChanged(false));
    };
  }, [dispatch]);

  const handleGetPasswordRecoveryLink = () => {
    const login = userAccount?.login ?? '';
    dispatch(getPasswordRecoveryLink(login));
  };

  const getAccessToken = async () => {
    const { data } = await authService.getSumsubToken();
    console.log(data.accessSumSubToken);
    return data.accessSumSubToken;
  };

  function launchWebSdk(apiUrl: string, accessToken: string) {
    let snsWebSdkInstance = snsWebSdk
      .Builder(apiUrl)
      .withAccessToken(accessToken, async (newAccessTokenCallback) => {
        let newAccessToken = getAccessToken();
        newAccessTokenCallback(await newAccessToken);
      })
      .withConf({
        lang: 'ru',
        onMessage: (type, payload) => {
          console.log('WebSDK onMessage', type, payload);
        },

        onError: (error) => {
          console.error('WebSDK onError', error);
        },
      })
      .build();

    snsWebSdkInstance.launch(iframeDiv?.current ?? '');
  }

  const handleOpenSumSub = async () => {
    const accessToken = await getAccessToken();
    setPopup(
      <Overlay onClick={() => setPopup(null)}>
        <Popup onClose={() => setPopup(null)}>
          <Box
            ref={iframeDiv}
            sx={{
              marginTop: {
                xs: '24px',
                md: '40px',
              },
            }}
          />
        </Popup>
      </Overlay>
    );
    launchWebSdk('https://test-api.sumsub.com', accessToken);
  };

  const handleOpenFormName = () => {
    setPopup(
      <Overlay onClick={() => setPopup(null)}>
        <Popup onClose={() => setPopup(null)}>
          <ChangeNameForm />
        </Popup>
      </Overlay>
    );
  };

  const handleOpen2faEnableForm = () => {
    setPopup(
      <Overlay onClick={() => setPopup(null)}>
        <Popup
          title={`${userAccount?.is2FAEnabled ? 'Отключить' : 'Подключить'} двухфакторную аутентификацию`}
          onClose={() => setPopup(null)}
        >
          {userAccount?.is2FAEnabled ? (
            <TwoFactorDisableForm />
          ) : (
            <TwoFactorEnableForm />
          )}
        </Popup>
      </Overlay>
    );
  };

  useEffect(() => {
    if (successNameChanged) {
      setPopup(
        <SuccessPopup
          onClose={() => {
            setPopup(null);
          }}
          message="Никнейм создан!"
        />
      );
    }
  }, [successNameChanged, dispatch, setPopup]);

  useEffect(() => {
    if (userError) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setPopup(null);
          }}
          errorMessage={userError.message}
        />
      );
    }
  }, [userError]);

  const onChangeName = useCallback(() => {
    setPopup(
      <Overlay onClick={() => setPopup(null)}>
        <Popup
          title="Создать никнейм"
          onClose={() => setPopup(null)}
        >
          <ChangeNameForm />
        </Popup>
      </Overlay>
    );
  }, []);

  return (
    <>
      <ProfileItem sx={{
        mt: {
          sm: '24px',
          md: '0px'
        }
      }}>
        <Box mr='24px' width='78px'>
          <img src={NickNameIcon} alt="" />
        </Box>
        <ProfileItemInfo>
          <ProfileItemTitle>Никнейм</ProfileItemTitle>
          <ProfileItemDescription>
            Укажите никнейм, который будет использоватся в P2P секции. Изменить
            никнейм в дальнейшем будет невозможно.
          </ProfileItemDescription>
        </ProfileItemInfo>
        <StyledBorderedButton onClick={onChangeName}>
          Создать
        </StyledBorderedButton>
      </ProfileItem>
      <ProfileItem>
        <Box mr='24px' width='78px'>
          <img src={TelegramIcon} alt="" />
        </Box>
        <ProfileItemInfo>
          <ProfileItemTitle>
            Телеграм уведомления
          </ProfileItemTitle>
          <ProfileItemDescription>
            Подпишитесь на получение уведомлений через Телеграм, перейдя по
            кнопке Подписаться и нажав Start.
          </ProfileItemDescription>
        </ProfileItemInfo>
        <a href="https://t.me" target="_blank" rel="noreferrer">
          <StyledBorderedButton>Подписаться</StyledBorderedButton>
        </a>
      </ProfileItem>
      <ProfileItem>
        <Box mr='24px' width='78px'>
          <img src={ConfirmationIcon} alt="" />
        </Box>
        <ProfileItemInfo>
          <ProfileItemTitle>
            Подтвердить аккаунт
          </ProfileItemTitle>
          <ProfileItemDescription>
            Подтвердите ваш аккаунт, пройдя процедуру KYC.
          </ProfileItemDescription>
        </ProfileItemInfo>
        <Box ml='10px' fontSize='16px' display='flex' alignItems='center' color='#00bc40'>
          {userAccount?.isVerifiedKYC ? (
            'Подтвержден'
          ) : (
            <StyledBorderedButton onClick={handleOpenSumSub}>
              Подтвердить
            </StyledBorderedButton>
          )}
        </Box>
      </ProfileItem>
      <ProfileItem>
        <Box mr='24px' width='78px'>
          <img src={GoogleIcon} alt="" />
        </Box>
        <ProfileItemInfo>
          <ProfileItemTitle>
            Google Authenticator
          </ProfileItemTitle>
          <ProfileItemDescription>
            Google Authenticator обеспечивает еще один уровень безопасности
            вашей учетной записи
          </ProfileItemDescription>
        </ProfileItemInfo>
        <StyledBorderedButton onClick={handleOpen2faEnableForm}>
          {userAccount?.is2FAEnabled ? 'Отключить' : 'Включить'}
        </StyledBorderedButton>
      </ProfileItem>
      <ProfileItem>
        <Box mr='24px' width='78px'>
          <img src={PasswordIcon} alt="" />
        </Box>
        <ProfileItemInfo>
          <ProfileItemTitle>Пароль</ProfileItemTitle>
          <ProfileItemDescription>
            Этот пароль необходим для входа в систему, пожалуйста, запомните
            его.
          </ProfileItemDescription>
        </ProfileItemInfo>
        <StyledBorderedButton onClick={handleGetPasswordRecoveryLink}>
          Изменить
        </StyledBorderedButton>
      </ProfileItem>
    </>
  );
};