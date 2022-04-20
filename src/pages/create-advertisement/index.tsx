import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Box,
  Typography,
  styled,
  FormLabel,
  useTheme,
} from '@mui/material';
import {
  TabsListUnstyled,
  TabUnstyled,
  tabUnstyledClasses,
  TabsUnstyled
} from '@mui/base';
import React, { useCallback, useEffect, useState } from 'react';
import { getMarketsOtc, selectMarkets } from '../../store/marketSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  AdvertisementPropsType,
  createAdvertisement,
  getPaymentMethods,
  selectError,
  selectPaymentMethods,
  setError,
} from '../../store/otcSlice';
import Tabs from '../../components/Tabs';
import {
  SubmitHandler,
  useForm,
  Controller,
  FormProvider,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MinusCounterIcon from '../../icons/MinusCounterIcon.svg';
import PlusCounterIcon from '../../icons/PlusCounterIcon.svg';
import TooltipIcon from '../../icons/TooltipIcon.svg';
import { NumberFormatCustom } from '../../components/NumberFormat';
import usePopup from '../../hooks/usePopup';
import TabsSwitcher from '../../components/TabsSwitcher';
//import { useTheme } from '@material-ui/core';
import { AppDispatch } from '../../store';
import * as Yup from 'yup';
import { SuccessPopup } from '../../components/SuccessPopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import { OverlayPopup } from '../../components/OverlayPopup';
import { AlertPopup } from '../../components/AlertPopup';
import { StyledMainButton } from '../../components/Popup/Popup.styled';
import NumberFormat from 'react-number-format';

const advertisementFormSchema = Yup.object().shape({
  volume: Yup.number()
    .typeError('Обязательное числовое поле')
    .max(Yup.ref('volumeMax'), 'Больше максимальной суммы'),

  volumeMax: Yup.number()
    .typeError('Обязательное числовое поле')
    .min(Yup.ref('volume'), 'Меньше минимальной суммы'),

  factor: Yup.number()
    .required('Поле обязательное')
    .typeError('Поле обязательное'),

  side: Yup.string(),
  paymentMethodId: Yup.string(),
  privateMode: Yup.string(),
});

const CreateAdvertisementPopup = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const paymentMethods = useAppSelector(selectPaymentMethods);
  const markets = useAppSelector(selectMarkets);
  const error = useAppSelector(selectError);
  const theme = useTheme();
  const [sideTab, setSideTab] = useState(0);
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [currencyType, setCurrencyType] = useState('fiat');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [fiatCurrencies, setFiatCurrencies] = useState<string[]>([]);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<string[]>([]);
  const { setPopup } = usePopup();
  const [paymentMethodIds, setPaymentMethodIds] = useState<string[]>([]);
  const [fromCurrencyTab, setFromCurrencyTab] = useState<number>(0);

  const form = useForm({
    reValidateMode: 'onBlur',
    resolver: yupResolver(advertisementFormSchema),
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = form;

  const factor = watch('factor');

  useEffect(() => {
    dispatch(
      getPaymentMethods({
        page: 1,
        take: 20,
      })
    );
    dispatch(getMarketsOtc());

    return () => {
      dispatch(setError(null));
    };
  }, []);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setPopup(null);
            dispatch(setError(null));
          }}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  useEffect(() => {
    if (markets) {
      const tmpObj: {
        mainCurrencyList: string[];
      } = {
        mainCurrencyList: [],
      };

      markets.forEach((market) => {
        if (tmpObj.mainCurrencyList.indexOf(market.mainCurrencyId) === -1) {
          tmpObj.mainCurrencyList.push(market.mainCurrencyId);
        }
      });
      setCurrencyList(tmpObj.mainCurrencyList);
      setFromCurrency("RUB");
    }
  }, [markets]);

  useEffect(() => {
    if (fromCurrency) {
      /**
       * для trx нет фиата, поэтому его нужно скрыть, и выбрать по дефолту крипту.
       */
      setCurrencyType('fiat');

      const filteredMarkets = markets.filter(
        (market) => market.mainCurrencyId === fromCurrency
      );
      const fiatList = filteredMarkets
        .filter((market) => !market.paidCurrency.isCoin)
        .map((market) => market.paidCurrency.id);

      const cryptoList = filteredMarkets
        .filter((market) => market.paidCurrency.isCoin)
        .map((market) => market.paidCurrency.id);
      setFiatCurrencies(fiatList);
      setCryptoCurrencies(cryptoList);
      setToCurrency('RUB')
    }
  }, [fromCurrency]);

  /**
   * from currency listener
   */
  useEffect(() => {
    try {
      const currency = currencyList[fromCurrencyTab];
      setFromCurrency(currency);
    } catch (err) {
      console.log(err);
    }
  }, [fromCurrencyTab]);

  const onSubmit: SubmitHandler<AdvertisementPropsType> = useCallback(
    async (data) => {
      if (toCurrency && data.volume && data.volumeMax) {
        data.marketId = `${fromCurrency}${toCurrency}`;
        data.factor = data.factor / 100;
        data.paymentMethodIds = paymentMethodIds;
        data.side = sideTab === 0 ? 'ask' : 'bid';
        if(data.paymentMethodIds.length>0 || currencyType == 'crypto'){
          const result = await dispatch(createAdvertisement(data));
          if (result && result.payload) {
            setPopup(
              <SuccessPopup
                onClose={() => setPopup(null)}
                message="Объявление успешно создано!"
              />
            );
          }
        }else{
          setPopup(
            <AlertPopup
              title="Подтверждение"
              closeable={true}
              onClose={() => setPopup(null)}
              positiveButton="Подтвердить"
              onPositiveButtonClick={async()=>{
                const result = await dispatch(createAdvertisement(data));
                if (result && result.payload) {
                  setPopup(
                    <SuccessPopup
                      onClose={() => setPopup(null)}
                      message="Объявление успешно создано!"
                    />
                  );
              }}}
              >
                Вы не выбрали метод оплаты, метод оплаты будет "Любой"
            </AlertPopup>
          )
        }
      }
    },
    [toCurrency, fromCurrency, paymentMethodIds, sideTab, currencyType]
  );

  const incrementFactor = useCallback(() => {
    if (isNaN(Number(factor))) {
      setValue('factor', 0.1);
      return;
    }
    if (Number(factor) >= 20) {
      return;
    }
    setValue('factor', (Number(factor) + 0.1).toFixed(2));
  }, [factor]);

  const decrementFactor = useCallback(() => {
    if (isNaN(Number(factor))) {
      setValue('factor', -0.1);
      return;
    }
    if (Number(factor) <= -20) {
      return;
    }
    setValue('factor', (Number(factor) - 0.1).toFixed(2));
  }, [factor]);

  return (
    <OverlayPopup
      title="Новое объявление"
      onClose={() => setPopup(null)}
      fixedWidth={false}
    >
      <Box>
      <Box mt="20px" mb="20px">
        <TabsSwitcher
          items={['Продаю', 'Покупаю']}
          onChanged={(index) => setSideTab(index)}
          defaultValue={sideTab}
        />
      </Box>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('volume')} />
          <input type="hidden" {...register('volumeMax')} />


          <FormLabel>Количество</FormLabel>

          <Box
            mt="10px"
            mb="20px"
            display="flex"
            alignItems="center"
            gap="10px"
            sx={{
              flexDirection: {
                sm: 'column',
                md: 'row',
              },
              alignItems: {
                sm: 'flex-start',
                md: 'center',
              },
            }}
          >
            <Box sx = {{
              width: {
                sm: '100%',
                md:'50%'
              }
            }}>
              <NumberFormat
              
                type="text"
                displayType="input"
                customInput={SummTextField}
                thousandsGroupStyle="thousand"
                decimalSeparator="."
                decimalScale={['BTC', 'ETH'].includes(fromCurrency) ? 8 : 2}
                thousandSeparator=" "
                allowLeadingZeros={true}
                allowNegative={false}
                style={{
                  padding: '12px 0px',
                  width: '100%',
                  border: 0,
                  borderBottom: '2px solid ' + theme.palette.primary.main,
                  boxSizing: 'border-box',
                }}
                placeholder="Минимум"
                onValueChange={(v) => setValue('volume', v.floatValue)}
                isAllowed={(v) => {
                  return v && v.floatValue
                    ? fromCurrency === 'BTC'
                      ? v.floatValue >= 0.0001
                      : fromCurrency === 'ETH'
                        ? v.floatValue >= 0.001
                        : v.floatValue >= 1.0
                    : true;
                }}
              />

              <Box color="#ff0000" mt="10px">
                {errors.volume && <>{errors.volume.message}</>}
              </Box>
            </Box>

            <Box  sx = {{
              width: {
                sm: '100%',
                md:'50%'
              }
            }}>
              <NumberFormat
                thousandsGroupStyle="thousand"
                decimalSeparator="."
                decimalScale={['BTC', 'ETH'].includes(fromCurrency) ? 8 : 2}
                displayType="input"
                customInput={SummTextField}
                thousandSeparator=" "
                allowLeadingZeros={true}
                allowNegative={false}
                style={{
                  padding: '12px 0px',
                  width: '100%',
                  border: 0,
                  borderBottom: '2px solid ' + theme.palette.primary.main,
                  boxSizing: 'border-box',
                }}
                placeholder="Максимум"
                onValueChange={(v) => setValue('volumeMax', v.floatValue)}
              />

              <Box color="#ff0000" mt="10px">
                {errors.volumeMax && <>{errors.volumeMax.message}</>}
              </Box>
            </Box>


          </Box>

          {sideTab === 0 && (
              <Box display="flex" alignItems="center" gap="10px" pb= '20px'>
                <img src={TooltipIcon} alt="" />
                <Box color="#696969">
                  Во время создания объявления платформа закладывает размер комиссии в 0.5%.
                </Box>
              </Box>
            )}

          {currencyType === 'fiat' && (
            <>
              <FormLabel>Метод оплаты</FormLabel>
              <Box
                mt="10px"
                mb="20px"
                display="flex"
                gap="10px"
                flexWrap="wrap"
                sx={{
                  flexDirection: {
                    sm: 'column',
                    md: 'row',
                  },
                  alignItems: {
                    sm: 'flex-start',
                    md: 'center',
                  },
                }}
              >
                {paymentMethods.map((paymentMethod) => (
                  <PaymentMethodButton
                    style={{
                      flex: '1 0 21%',
                      border:
                        paymentMethodIds.indexOf(paymentMethod.id) !== -1
                          ? '2px solid #CBA977'
                          : '',
                      backgroundColor:
                        paymentMethodIds.indexOf(paymentMethod.id) !== -1
                          ? '#ffffff'
                          : '',
                          color: 
                          paymentMethodIds.indexOf(paymentMethod.id) !== -1
                          ? '#CBA977'
                          : '',
                    }}
                    key={paymentMethod.id}
                    onClick={() => {
                      if (paymentMethodIds.indexOf(paymentMethod.id) !== -1) {
                        setPaymentMethodIds(
                          paymentMethodIds.filter(
                            (id) => id !== paymentMethod.id
                          )
                        );
                      } else {
                        setPaymentMethodIds((paymentMethodIds) => [
                          paymentMethod.id,
                          ...paymentMethodIds,
                        ]);
                      }
                    }}
                  >
                    {paymentMethod.name}
                  </PaymentMethodButton>
                ))}
              </Box>
            </>
          )}

          <FormLabel>Ставка</FormLabel>
          <Box
            mt="10px"
            mb="20px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="10px"
            sx={{
              flexDirection: {
                sm: 'column',
                md: 'row',
              },
              alignItems: {
                sm: 'flex-start',
                md: 'center',
              },
            }}
          >
            <Box display="flex" flexDirection="column">
              <Controller
                control={control}
                name="factor"
                render={({ field }) => (
                  <TextField
                    {...field}
                    name="%"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={incrementFactor}>
                            <img src={PlusCounterIcon} alt="" />
                          </IconButton>
                          <IconButton onClick={decrementFactor}>
                            <img src={MinusCounterIcon} alt="" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      inputComponent: NumberFormatCustom as any,
                    }}
                    variant="standard"
                  />
                )}
              />
              <Box color="#ff0000" mt="10px">
                {errors.factor && errors.factor.message}
              </Box>
            </Box>

            <Label>
              {factor >= 0
                ? sideTab === 0 ? 'Доплачивает покупатель' : 'Вы доплачиваете'
                : sideTab === 0 ? 'Вы доплачиваете' : 'Доплачивает продавец'}
            </Label>
          </Box>

          <Box mt="20px" color="#696969">
            Условия сделки
          </Box>
          <Box mt="10px" mb="20px">
            <Controller
              control={control}
              name="conditionsTrade"
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="standard"
                  multiline
                  fullWidth
                />
              )}
            />
          </Box>

          <Box mt="20px" color="#696969">
            Приватность
          </Box>
          <Box mt="10px" mb="20px">
            <RadioGroup row name="privateMode" defaultValue="public">
              <FormControlLabel
                value={'public'}
                control={<Radio />}
                label={'Доступно для всех'}
                {...register('privateMode')}
              />
              <FormControlLabel
                value={'reference'}
                control={<Radio />}
                disabled
                label={'Только по ссылке'}
                {...register('privateMode')}
              />
            </RadioGroup>
          </Box>



          <Box mt="20px">
            <StyledMainButton type="submit">
              Создать объявление
            </StyledMainButton>
          </Box>
        </form>
      </FormProvider>
      </Box>
    </OverlayPopup >
  );
};

const PaymentMethodButton = styled(Button)`
  border-radius: 36px;
  border: 1px solid transparent;
  color: #000000;
  background-color: #f5f5f5;
  text-transform: unset;
`;

const Label = styled(Box)`
  background-color: #f5f5f5;
  color: ${(props) => props.theme.palette.primary.main};
  padding: 6px 10px;
  font-weight: 500;
  border-radius: 36px;
  font-size: 14px;
  line-height: 21px;
  text-align: center
`;

const StyledTabsList = styled(TabsListUnstyled)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

const StyledTab = styled(TabUnstyled)`
  display: flex;
  align-items: center;
  background-color: rgba(245, 245, 245, 1);
  border-radius: 32px;
  border: 0;
  padding: 10px 18px;
  cursor: pointer;
  border: 2px solid transparent;
  &.${tabUnstyledClasses.selected} {
    color: ${(props) => props.theme.palette.primary.main};
    background-color: #ffffff;
    font-weight: 500;
    border-color: ${(props) => props.theme.palette.primary.main};
  }
`;

const SummTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    padding: '4px 0 5px',
  },
  '& fieldset.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export default CreateAdvertisementPopup;
