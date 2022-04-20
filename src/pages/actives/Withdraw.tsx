import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import {
  createCryptoOut,
  CryptoOutProps,
  getCryptoFee,
  getOutFee,
  selectCryptoFee,
  setLastError,
  WalletType,
  selectWallets,
  getFullCode,
  postCreateCode,
  selectFullCode,
  CreationCodeType,
  getListMyCode,
} from '../../store/walletSlice';
import { selectUser } from '../../store/userSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  styled,
  TextField,
  useTheme,
} from '@mui/material';
import {
  TabsUnstyled
} from '@mui/base';

import useAppSelector from '../../hooks/useAppSelector';
import * as Yup from 'yup';
import usePopup from '../../hooks/usePopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import { SuccessPopup } from '../../components/SuccessPopup';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AppDispatch, RootState } from '../../store';
import { StyledTab, StyledTabsList } from './Actives.styled';
import { idText } from 'typescript';

const schema = Yup.object().shape({
  address: Yup.string().required('Поле обязательное'),
});

interface WithdrawProps {
  selectedWallet: WalletType;
}

const Withdraw: FC<WithdrawProps> = ({ selectedWallet }) => {
  const [selectedPercent, setSelectedPercent] = useState(0);
  const cryptoFee = useAppSelector(selectCryptoFee);
  const [networkId, setNetworkId] = useState('');
  //const outFee = useAppSelector((state) => state.wallet.outFee);
  const user = useAppSelector(selectUser);
  const fullCodes = useAppSelector(selectFullCode);
  const [tab, setTab] = useState<number>(0);
  const dispatch: AppDispatch = useAppDispatch();
  const theme = useTheme();
  const { setPopup } = usePopup();
  const [volume, setVolume] = useState<number>(0);
  const lastError = useAppSelector(
    (state: RootState) => state.wallet.lastError
  );
  const wallets = useAppSelector(selectWallets);

  const form = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const formRub = useForm({
    mode: 'all'
  });

  const networks = useMemo(() => {
    const wallet = wallets.find((wallet) => wallet?.currency_id === selectedWallet.currency_id)
    const walletAddress = wallet?.real_address
    return walletAddress ? walletAddress.map(k => k.network) : []
  }, [selectedWallet]);

  useEffect(() => {
    setTab(0);
    form.setValue('total', '0');
  }, []);

  useEffect(() => {
    setNetworkId(networks[0]);

    form.reset();

    form.setValue('walletId', selectedWallet.id);
  }, [selectedWallet]);

  useEffect(() => {
    if (cryptoFee) {
      dispatch(getOutFee(cryptoFee.currencyId));
      form.setValue('fee', '0');
    }
  }, [cryptoFee]);

  useEffect(() => {
    if (selectedPercent && selectedWallet) {
      setVolume(selectedPercent * selectedWallet.service_balance * 0.01);
    }
  }, [selectedPercent]);

  useEffect(() => {
    if (networkId && volume) {
      dispatch(
        getCryptoFee({
          currencyId: selectedWallet.currency_id,
          networkId,
          volume
        })
      );
    }
  }, [networkId, volume]);

  useEffect(() => {
    if (volume !== undefined) {
      form.setValue('volume', volume);
      form.setValue('total', volume);
      formRub.setValue('amount', volume);
      formRub.setValue('currency', selectedWallet.currency_id);
    }
  }, [volume]);

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

  const onSubmit = useCallback(
    async (data: CryptoOutProps) => {
      const volume = Number(form.getValues('volume'));
      if (volume > 0 && volume <= selectedWallet.service_balance) {
        form.reset();
        setVolume(0);

        data.networkId = networkId

        const result = await dispatch(createCryptoOut(data));

        result &&
          result.payload &&
          setPopup(
            <SuccessPopup
              onClose={() => setPopup(null)}
              message="Операция прошла успешно!"
            />
          );
      }
    },
    [cryptoFee]
  );
  const onSubmitRub = useCallback(
    async (data: CreationCodeType) => {
      const amount = Number(formRub.getValues('amount'));
      if (amount > 0 && amount <= selectedWallet.service_balance) {
        formRub.reset();
        setVolume(0);

        const result = await dispatch(postCreateCode(data));
        const list = await dispatch(getListMyCode());
        const currentCode = list.payload.find((el: { code: any; }) => result.payload.code === el.code)
        console.log('3', currentCode)
        const res = await dispatch(getFullCode(currentCode.id))
        user &&
          user.id &&
          result &&
          result.payload &&
          setPopup(
            <SuccessPopup
              onClose={() => setPopup(null)}
              message={`Ваш код пополнения - ${res.payload}`}
            />
          );
      }
    },
    [cryptoFee]
  );

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
          Вывести {selectedWallet.currency_id}
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
      <Box mt="32px">
        <FormProvider {...formRub}>
           <form onSubmit={formRub.handleSubmit(onSubmitRub)}>
            <input type="hidden" {...formRub.register('currency')} />
            <input type="hidden" {...formRub.register('amount')} />

            <Box mt="20px">
              <StyledFormLabel>Сумма вывода</StyledFormLabel>
                <Box display="flex"
                  style={{
                    position: "relative"
                  }}
                    alignItems="center" gap="10px">
                  <Box flex="1">
                    <NumberFormat
                      thousandsGroupStyle="thousand"
                      decimalSeparator="."
                      displayType="input"
                      customInput={OutSummTextField}
                      thousandSeparator=" "
                      allowLeadingZeros={true}
                      allowNegative={false}
                      style={{
                        width: '100%',
                        border: 0,
                        borderBottom: '2px solid ' + theme.palette.primary.main,
                        boxSizing: 'border-box',
                        userSelect: 'none',
                      }}
                      value={volume}
                      onValueChange={(values: NumberFormatValues) => {
                        setVolume(values.floatValue ? values.floatValue : 0);
                      }}
                      isAllowed={(values: NumberFormatValues) => {
                        const { floatValue } = values;
                        return (
                          !floatValue ||
                          (floatValue >= 0 &&
                            floatValue <= selectedWallet.service_balance)
                        );
                      }}
                      disabled={selectedWallet.service_balance === 0}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 10
                      
                    }}
                    flex="1" display="flex" alignItems="center" gap="10px">
                  {selectedWallet.service_balance > 0 &&
                    Array.from(Array(4).keys())
                      .map((i) => i * 25 + 25)
                      .map((p) => (
                        <PercentButton
                          style={{
                            backgroundColor:
                              p === selectedPercent
                                ? theme.palette.primary.main
                                : '',
                          }}
                          onClick={() => setSelectedPercent(p)}
                        >
                          {p}%
                        </PercentButton>
                      ))}
                </Box>
              </Box>
            </Box>

            <Box mt="24px">
              <StyledFormLabel>Комиссия</StyledFormLabel>

              <Box display="flex" alignItems="center" gap="10px">
                <StyledTextField
                  disabled
                  fullWidth
                  variant="standard"
                  value="Без комиссии"
                />
                {/* <Box fontWeight="bold">{cryptoFee.currencyId}</Box> */}
              </Box>
            </Box>

            <Box mt="24px">
              <StyledFormLabel>Сумма выплаты</StyledFormLabel>
              <Box>
                <StyledTextField
                  disabled
                  variant="standard"
                  fullWidth
                  {...form.register('total')}
                />
              </Box>
            </Box>

            <Box mt="24px">
              <StyledFormLabel>Код Google Authenticator</StyledFormLabel>
              <Box>
                <StyledTextField
                  variant="standard"
                  fullWidth
                />
              </Box>
            </Box>

            {/* <Box mt="24px">
              <StyledFormLabel>Условия по выводу или описание, если требуется такое</StyledFormLabel>
            </Box> */}

            <Box mt="20px">
              <StyledButton
                type="submit"
                disabled={!formRub.formState.isValid || volume === 0}
              >
                Подтвердить
              </StyledButton>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  ) : selectedWallet.isCoin ? (
    <Box mb="20px">
      <Box
        color={theme.palette.secondary.dark}
        sx={{
          paddingTop: '14px',
          lineHeight: '21px',
          fontSize: '14px',
        }}
      >
        Способ вывода
      </Box>
      <Box mt="20px">
        <TabsUnstyled
          value={tab}
          onChange={(
            event: React.SyntheticEvent,
            newValue: string | number
          ) => {
            form.reset();

            const index = Number(newValue);

            setTab(index);
            setNetworkId(networks[index]);
          }}
        >
          <StyledTabsList>
            {networks.map((item) => (
              <StyledTab>{item}</StyledTab>
            ))}
          </StyledTabsList>
        </TabsUnstyled>
      </Box>

      <Box mt="24px" fontSize="14px" lineHeight="21px">
        Пожалуйста, введите адрес, сумму, затем нажмите "Отправить". Заявка
        будет подтверждена Оператором в течение нескольких минут.
      </Box>

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
          Вывести {selectedWallet.currency_id}
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
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input type="hidden" {...form.register('currency')} />
            <input type="hidden" {...form.register('volume')} />

            <Box>
              <StyledFormLabel>Адрес вывода</StyledFormLabel>
              <TextField
                variant="standard"
                fullWidth
                {...form.register('address')}
              />
            </Box>

            <Box mt="20px">
              <StyledFormLabel>Сумма вывода</StyledFormLabel>
                <Box display="flex"
                  style={{
                    position: "relative"
                  }}
                    alignItems="center" gap="10px">
                  <Box flex="1">
                    <NumberFormat
                      thousandsGroupStyle="thousand"
                      decimalSeparator="."
                      displayType="input"
                      customInput={OutSummTextField}
                      thousandSeparator=" "
                      allowLeadingZeros={true}
                      allowNegative={false}
                      style={{
                        width: '100%',
                        border: 0,
                        borderBottom: '2px solid ' + theme.palette.primary.main,
                        boxSizing: 'border-box',
                        userSelect: 'none',
                      }}
                      value={volume}
                      onValueChange={(values: NumberFormatValues) => {
                        setVolume(values.floatValue ? values.floatValue : 0);
                      }}
                      isAllowed={(values: NumberFormatValues) => {
                        const { floatValue } = values;
                        return (
                          !floatValue ||
                          (floatValue >= 0 &&
                            floatValue <= selectedWallet.service_balance)
                        );
                      }}
                      disabled={selectedWallet.service_balance === 0}
                    />
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 10
                    }}
                    flex="1" display="flex" alignItems="center" gap="10px">
                  {selectedWallet.service_balance > 0 &&
                    Array.from(Array(4).keys())
                      .map((i) => i * 25 + 25)
                      .map((p) => (
                        <PercentButton
                          style={{
                            backgroundColor:
                              p === selectedPercent
                                ? theme.palette.primary.main
                                : '',
                          }}
                          onClick={() => setSelectedPercent(p)}
                        >
                          {p}%
                        </PercentButton>
                      ))}
                </Box>
              </Box>
            </Box>

            <Box mt="20px">
              <StyledFormLabel>Комиссия</StyledFormLabel>

              <Box display="flex" alignItems="center" gap="10px">
                <StyledTextField
                  disabled
                  fullWidth
                  variant="standard"
                  {...form.register('fee')}
                />
                {/* <Box fontWeight="bold">{cryptoFee.currencyId}</Box> */}
              </Box>
            </Box>

            <Box mt="20px">
              <StyledFormLabel>Сумма выплаты</StyledFormLabel>
              <Box>
                <StyledTextField
                  disabled
                  variant="standard"
                  fullWidth
                  {...form.register('total')}
                />
              </Box>
            </Box>

            <Box mt="20px">
              <StyledButton
                type="submit"
                disabled={!form.formState.isValid || volume === 0}
              >
                Отправить
              </StyledButton>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  ) : (
    <Box my="20px" textAlign="center" fontSize="18px" color="#999999" flex="1">
      Функция ввода и вывода RUB находится в разработке.
    </Box>
  );
};

const LoadingLayout = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
`;

const StyledFormLabel = styled(FormLabel)`
  color: #8F8982;
`

const PercentButton = styled(Box)`
  background-color: #999999;
  color: #ffffff;
  font-size: 12px;
  border-radius: 36px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
`;

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

const OutSummTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    padding: '4px 0 5px',
  },
  '& fieldset.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },

}));

const StyledTextField= styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root.Mui-disabled:before": {
    borderBottomStyle: 'solid'
  }
}));

export default Withdraw;
