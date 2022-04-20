import { FC, useCallback, useEffect, useState } from 'react';
import QRCodeReact from 'qrcode.react';
import Tabs from '../../components/Tabs';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import usePopup from '../../hooks/usePopup';
import useAppSelector from '../../hooks/useAppSelector';
import { FormProvider, useForm } from 'react-hook-form';
import { ErrorPopup } from '../../components/ErrorPopup';
import { SuccessPopup } from '../../components/SuccessPopup';
import {
  getActualAddress,
  selectActualAddress,
  WalletType,
  getWallets,
  redeemGiftCode,
  setLastError,
  selectWallets,
  DepositWithCode
} from '../../store/walletSlice';
import copyToClipboard from '../../helpers/copyToClipboard';
import useAppDispatch from '../../hooks/useAppDispatch';
import { AppDispatch, RootState } from '../../store';
import { Box, Typography, useTheme, FormLabel, Button, styled, TextField } from '@mui/material';
import TextFieldForCopy from '../../components/TextFieldForCopy';
import { StyledTab, StyledTabsList } from './Actives.styled';
import {
  TabsUnstyled,
} from '@mui/base';
interface ReplenishProps {
  selectedWallet: WalletType;
}

const Replenish: FC<ReplenishProps> = ({ selectedWallet }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const theme = useTheme();
  const wallets = useAppSelector(selectWallets);
  const { setPopup } = usePopup();
  const schema = Yup.object().shape({
    code: Yup.string().required('Поле обязательное'),
  });

  const lastError = useAppSelector(
    (state: RootState) => state.wallet.lastError
  );
  const actualAddress = useAppSelector(selectActualAddress);
  const [address, setAddress] = useState<string>('');
  const [tab, setTab] = useState<number>(0);
  const formRub = useForm({
    mode: 'all',
    resolver: yupResolver(schema)
  });
  useEffect(() => {
    selectedWallet && dispatch(getActualAddress(selectedWallet.id));
  }, [selectedWallet]);

  useEffect(() => {
    dispatch(getWallets());
  }, [selectedWallet])

  useEffect(() => {
    setAddress('');
    actualAddress &&
      actualAddress.find((item) => {
        if (item.network === getNetworkItems(selectedWallet.currency_id)[0]) {
          setAddress(item.address);
        }
      });
  }, [actualAddress]);

    useEffect(() => {
    if (lastError) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setPopup(null);
            dispatch(setLastError(null));
          }}
          errorMessage={lastError}
        />
      );
    }
  }, [lastError]);


  const onCopyAddress = useCallback((data: string) => {
    copyToClipboard(data);
  }, []);

  const onSubmit = useCallback(
    async (data: DepositWithCode) => {
      if (data && data.code) {
        formRub.reset();

        const result = await dispatch(redeemGiftCode(data));
        console.log(result)
        result &&
          result?.payload &&
            setPopup(
                <SuccessPopup
                  onClose={() => setPopup(null)}
                  message={`Средства успешно зачислены!`}
                />
              );
      }
    },
    [address]
  );

  const getNetworkItems = (currency_id: string) => {
    const wallet = wallets.find((wallet) => wallet?.currency_id === currency_id)
    const walletAddress = wallet?.real_address
    return walletAddress ? walletAddress.map(k => k.network) : []
  };

  const handleChange = (item: string) => {
    setAddress('');
    actualAddress &&
      actualAddress.find((re) => {
        if (re.network === item) {
          setAddress(re.address);
        }
      });
  };

  const networkItems = getNetworkItems(selectedWallet.currency_id);

  return !selectedWallet.isCoin && selectedWallet.currency_id === 'RUB' ? (
   <Box mb="20px">
      <Box
        mt="24px"
        display="flex"
        justifyContent="space-between"
        sx={{
          borderTop: {
            md: '1px solid #D9D9D9',
          },
          paddingTop: {
            md: '24px',
          },
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          alignItems: {
            sm: 'center',
          },
        }}
      >
        <Box fontSize="16px" fontWeight="bold">
          Пополнить {selectedWallet.currency_id}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          sx={{
            justifyContent: {
              xs: 'space-between',
            },
            paddingTop: {
              xs: '12px',
              sm: '0px',
            },
          }}
        >
          <Box color="#999999">Доступно к выводу:</Box>
          <Box fontWeight="bold">
            {selectedWallet.service_balance} {selectedWallet.currency_id}
          </Box>
        </Box>
      </Box>
      <Box mt="30px">
        <FormProvider {...formRub}>
          <form onSubmit={formRub.handleSubmit(onSubmit)}>
            
            <Box mt="32px">
              <StyledFormLabel>Код пополнения</StyledFormLabel>
              <TextField
                variant="standard"
                fullWidth
                {...formRub.register('code')}
              />
            </Box>

            <Box mt="24px">
              <StyledFormLabel>Условия по пополнению или описание, если требуется такое</StyledFormLabel>
            </Box>

            <Box mt="20px">
              <StyledButton
                type="submit"
                disabled={!formRub.formState.isValid}
              >
                Отправить
              </StyledButton>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  ) : !selectedWallet || !selectedWallet.isCoin ? (
    <Box my="20px" textAlign="center" fontSize="18px" color="#999999" flex="1">
      Функция ввода и вывода RUB находится в разработке.
    </Box>
  ) : (
    <Box display="flex">
      <Box
        sx={{
          flex: {
            md: '0.7',
          },
        }}
      >
        <Box
          color={theme.palette.secondary.dark}
          sx={{
            paddingTop: '14px',
            fontSize: '14px',
            lineHeight: '21px',
            mb: '20px',
          }}
        >
          Выберите сеть
        </Box>
        <Box
          sx={{
            margin: '10px 0 24px',
          }}
        >
          <TabsUnstyled
            value={tab}
            onChange={(
              event: React.SyntheticEvent,
              newValue: string | number
            ) => {
              const index = Number(newValue);

              setTab(index);
              handleChange(networkItems[index])
            }}
          >
          <StyledTabsList>
            {networkItems.map((item) => (
              <StyledTab>{item}</StyledTab>
            ))}
          </StyledTabsList>
        </TabsUnstyled>
        </Box>
        <Typography
          sx={{
            fontSize: '14px',
            lineHeight: '21px',
            mb: '24px',
          }}
        >
          Пожалуйста скопируйте адрес в Ваш кошелек, введите сумму, которую Вы
          хотите зачислить и подтвердите зачисление. Для оплаты из мобильного
          приложения отсканируйте QR код.
        </Typography>

        <Box
          sx={{
            display: {
              sm: 'block',
              md: 'none',
            },
          }}
        >
          {address ? (
            <QRCodeReact value={address} size={180} />
          ) : (
            <div> Ваш QR-код отсутствует</div>
          )}
        </Box>

        <div style={{ marginTop: '32px' }}>
          <Box sx={{
            fontSize: '14px',
            lineHeight: '21px',
            color: theme.palette.secondary.dark,
            marginBottom: '10px'
          }}>
            Ваша ссылка
          </Box>

          <TextFieldForCopy
            value={address}
            onClick={() => onCopyAddress(address)}
          />

          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '21px',
              color: '#ff1616',

              marginTop: {
                sm: '20px',
                md: '28px',
              },
              marginBottom: {
                sm: '0px',
                md: '24px',
              },
            }}
          >
            Это адрес депозита в формате {selectedWallet.currency_id} 34
            cимвола.
          </Typography>
        </div>
      </Box>
      <Box
        sx={{
          flex: '0.3',
          justifyContent: 'flex-end',
          marginLeft: ' 32px',
          alignItems: {
            sm: 'flex-start',
            md: 'center',
          },
          flexDirection: {
            sm: 'column',
            md: 'row',
          },
          display: {
            sm: 'none',
            md: 'flex',
          },
        }}
      >
        <Box>
          {address ? (
            <QRCodeReact value={address} size={180} />
          ) : (
            <div> Ваш QR-код отсутствует</div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const StyledTextField= styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root.Mui-disabled:before": {
    borderBottomStyle: 'solid'
  }
}));

const StyledFormLabel = styled(FormLabel)`
  color: #8F8982;
`

const StyledButton = styled(Button)`
  border-radius: 100px;
  background: #CBA977;
  color: white;
  height: 40px;
  width: 146px;
  &:hover {
    background: #CBA977;
  };
  &:disabled {
    color: white;
    background: rgba(203, 168, 119, 0.2)
  }
`

export default Replenish;
