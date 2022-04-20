import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TableCell,
  TableRow,
  TextField,
  useTheme,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
  tabUnstyledClasses,
} from '@mui/base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';
import { PagingTable } from '../../components/PagingTable';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getMarketsOtc, selectMarkets } from '../../store/marketSlice';
import {
  getAdvertisementList,
  getPaymentMethods,
  IFilter,
  selectAdvertisements,
  selectPaymentMethods,
} from '../../store/otcSlice';
import { selectUser } from '../../store/userSlice';
import DownArrowIcon from '../../icons/DownArrowIcon.svg';
import checkIsNotNull from '../../helpers/checkIsNotNull';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { AppDispatch, RootState } from '../../store';

interface AdvertisementProps {
  side: 'ask' | 'bid';
}

/**
 * Объявления P2P
 * @author Sasha Broslavskiy
 */
const Advertisements = ({ side }: AdvertisementProps) => {
  /** диспетчер состояния */
  const dispatch: AppDispatch = useAppDispatch();

  /** методы оплаты */
  const paymentMethods = useAppSelector(selectPaymentMethods);

  /** список объявлений с сервера */
  const advertisements = useAppSelector(selectAdvertisements);

  /** текущий пользователь */
  const user = useAppSelector(selectUser);

  /** флаг для фильтрации верфицированных пользователей в списке объявлений */
  const [onlyVerifiedUsers, setOnlyVerifiedUsers] = useState<boolean>(false);

  /** текущая тема */
  const theme = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<string | null>();
  const markets = useAppSelector(selectMarkets);
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [mainCurrency, setMainCurrency] = useState<string | undefined>();
  const [paidCurrency, setPaidCurrency] = useState<string | undefined>();
  const [showCurrencyFilter, setShowCurrencyFilter] = useState<boolean>(false);
  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);
  const [currencyTab, setCurrencyTab] = useState<number>(0);
  const totalAdvertisements = useAppSelector(
    (state: RootState) => state.otc.totalAdvertisements
  );

  const isAskSide = side === 'ask';

  const advertisementsOrderByVolumeMax = useMemo(
    () =>
      [...advertisements].sort((a, b) =>
        Number(a.volumeMax) > Number(b.volumeMax) ? -1 : 0
      ),
    [advertisements]
  );

  const items = useMemo(
    () =>
      advertisementsOrderByVolumeMax &&
      advertisementsOrderByVolumeMax.filter(
        (a) =>
          a.privateMode === 'public' &&
          a.side === side &&
          (!onlyVerifiedUsers ||
            (a.user.userIsVerified && onlyVerifiedUsers)) &&
          (!paymentMethod ||
            a.paymentMethods.find((item) => item.id === paymentMethod)) &&
          (!mainCurrency || a.market.mainCurrency.id === mainCurrency) &&
          (!paidCurrency || a.market.paidCurrency.id === paidCurrency) &&
          (!checkIsNotNull(min) || a.volume >= min!) &&
          (!checkIsNotNull(max) || a.volumeMax <= max!)
      ),
    [
      advertisementsOrderByVolumeMax,
      side,
      onlyVerifiedUsers,
      paymentMethod,
      mainCurrency,
      paidCurrency,
      min,
      max,
    ]
  );

  const ITEMS_PER_PAGE = 20;
  const currencyListOrder = ['BTC', 'ETH', 'TRX', 'USDT'];
  const fiatCurrencyList = ['RUB'];
  const cryptCurrencyList = ['USDT'];
  const history = useHistory();

  useEffect(() => {
    console.log(`get payment methods`);
    dispatch(
      getPaymentMethods({
        page: 1,
        take: 20,
      })
    );
    console.log(`get markets`);
    dispatch(getMarketsOtc());
    console.log(`get advertisement list`);

    onChangePage(1);
  }, []);

  useEffect(() => {
    if (markets) {
      const currencyListArray: string[] = markets.map(
        (market) => market.mainCurrencyId
      );

      const currencyListSet = new Set();

      setCurrencyList(
        currencyListArray
          .filter((item) => {
            return currencyListSet.has(item)
              ? false
              : currencyListSet.add(item);
          })
          .sort(
            (a: string, b: string): number =>
              currencyListOrder.indexOf(a) - currencyListOrder.indexOf(b)
          )
      );
    }
  }, [markets]);

  useEffect(() => {
    setMainCurrency(
      currencyTab === 0 ? undefined : currencyList[currencyTab - 1]
    );
  }, [currencyTab]);

  const onNameClick = useCallback((userId: string) => {
    history.push(
      generatePath('/advertisement/seller-profile/:userId', {
        userId,
      })
    );
  }, []);

  const onChangePaymentMethod = useCallback(
    (value) => setPaymentMethod(value === 'any' ? undefined : value),
    []
  );

  const onChangePage = useCallback(
    (page: number) => {
      let filters: IFilter[] = [
        {
          field: 'side',
          operator: '=',
          value: side,
        },
      ];

      if (min !== null) {
        filters.push({
          field: 'volume',
          operator: '>=',
          value: min,
        });
      }

      if (max !== null) {
        filters.push({
          field: 'volumeMax',
          operator: '<=',
          value: max,
        });
      }

      if (paymentMethod) {
        filters.push({
          field: 'paymentMethodId',
          operator: 'in',
          value: [
            paymentMethod
          ]
        })
      }

      if (onlyVerifiedUsers) {
        filters.push({
          field: 'verified',
          operator: '=',
          value: onlyVerifiedUsers
        })
      }

      if (mainCurrency) {
        filters.push({
          field: 'mainCurrency',
          operator: '=',
          value: mainCurrency
        })
      }

      if (paidCurrency) {
        filters.push({
          field: 'paidCurrency',
          operator: '=',
          value: paidCurrency
        })
      }
      

      dispatch(
        getAdvertisementList({
          page,
          take: ITEMS_PER_PAGE,
          filters,
        })
      );
    },
    [side, min, max, paymentMethod, onlyVerifiedUsers, mainCurrency, paidCurrency]
  );

  useEffect(() => onChangePage(1), [side, min, max, paymentMethod, onlyVerifiedUsers, mainCurrency, paidCurrency]);

  return (
    <>
      {paymentMethods &&
      markets &&
      markets.length ? (
        <>
          <Box
            display="flex"
            gap="25px"
            mt="24px"
            sx={{
              alignItems: {
                sm: 'stretch',
                md: 'flex-end',
              },
              flexDirection: {
                sm: 'column',
                md: 'row',
              },
            }}
          >
            <Box flex="1" position="relative">
              <Box onClick={() => setShowCurrencyFilter(true)}>
                <TextField
                  label="Оплата"
                  variant="standard"
                  fullWidth
                  value={
                    paidCurrency
                      ? fiatCurrencyList.includes(paidCurrency)
                        ? `${paidCurrency}(Фиат)`
                        : `${paidCurrency}(Крипта)`
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <img src={DownArrowIcon} alt="" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {showCurrencyFilter && (
                <ClickAwayListener
                  onClickAway={() => setShowCurrencyFilter(false)}
                >
                  <Box
                    p="15px"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      border: '0',
                      boxShadow: '0 0 14px 7px rgba(0, 0, 0, 0.1)',
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                    }}
                    zIndex="1"
                    mt="5px"
                  >
                    <Box mb="10px">Оплата за Фиат:</Box>
                    <Box display="flex" gap="10px">
                      {fiatCurrencyList.map((item) => (
                        <Box
                          style={{
                            border:
                              paidCurrency && paidCurrency === item
                                ? `2px solid ${theme.palette.primary.main}`
                                : `2px solid #d9d9d9`,
                            borderRadius: '36px',
                            padding: '7px 16px',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setPaidCurrency(item);
                            setShowCurrencyFilter(false);
                          }}
                        >
                          {item}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </ClickAwayListener>
              )}
            </Box>

            <Box
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="10px"
            >
              <Box>от</Box>
              <NumberFormat
                thousandsGroupStyle="thousand"
                allowedDecimalSeparators={['.', ',']}
                displayType="input"
                customInput={SummIntervalTextField}
                thousandSeparator=" "
                allowLeadingZeros={true}
                value={min}
                style={{
                  width: '100%',
                  border: 0,
                  borderBottom: '2px solid ' + theme.palette.primary.main,
                  boxSizing: 'border-box',
                }}
                onValueChange={(values: NumberFormatValues) => {
                  const { floatValue } = values;

                  setMin(floatValue ?? null);
                }}
              />

              <Box>до</Box>

              <NumberFormat
                thousandsGroupStyle="thousand"
                allowedDecimalSeparators={['.', ',']}
                displayType="input"
                customInput={SummIntervalTextField}
                thousandSeparator=" "
                allowLeadingZeros={true}
                value={max}
                style={{
                  width: '100%',
                  border: 0,
                  borderBottom: '2px solid ' + theme.palette.primary.main,
                  boxSizing: 'border-box',
                }}
                onValueChange={(values: NumberFormatValues) => {
                  const { floatValue } = values;

                  setMax(floatValue ?? null);
                }}
                allowNegative={false}
              />
            </Box>

            <Box flex="1" alignItems="flex-end" sx={{ paddingTop: '10px' }}>
              <FormControl fullWidth>
                <Select
                  value={paymentMethod ? paymentMethod : 'any'}
                  onChange={(event: SelectChangeEvent) =>
                    onChangePaymentMethod(event.target.value)
                  }
                  fullWidth
                  variant="standard"
                >
                  <MenuItem sx={{ width: '100%' }} value={'any'}>
                    Метод оплаты (любой)
                  </MenuItem>
                  {paymentMethods.map((paymentMethod) => (
                    <MenuItem value={paymentMethod.id}>
                      {paymentMethod.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box mt="24px">
            <FormControlLabel
              control={<Checkbox defaultChecked={onlyVerifiedUsers} />}
              label="Только верифицированные продавцы"
              onChange={(event, checked) => setOnlyVerifiedUsers(checked)}
            />
          </Box>

          <Divider mt="24px" mb="24px" mx="-24px" />

          <Typography fontWeight="600" fontSize="16px" lineHeight="24px">
            Предложения
          </Typography>
          <Box mt="20px">
            <PagingTable
              items={advertisements}
              itemsPerPage={ITEMS_PER_PAGE}
              total={totalAdvertisements}
              heads={[
                'Продавец',
                'Метод оплаты',
                'Ставка',
                'Сумма',
                'Скорость ответа',
                '',
              ]}
              loading={false}
              onRow={(item, index) => (
                <StyledTableRow key={item.id}>
                  <TableCell onClick={() => onNameClick(item.user.userId)}>
                    <Box display="flex">
                      <Box fontSize="14px" fontWeight="500">
                        {item.user.name}
                      </Box>
                      <Box></Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.paymentMethods.length > 0
                      ? item.paymentMethods
                          .map((paymentMethod) => paymentMethod.name)
                          .join(', ')
                      : 'Любой'}
                  </TableCell>
                  <TableCell>
                    {(item.factor * 100).toFixed(1)}% (
                    {item.factor < 0
                      ? isAskSide
                        ? 'доплата вам'
                        : 'вы доплачиваете'
                      : isAskSide
                      ? 'вы доплачиваете'
                      : 'доплата вам'}
                    )
                  </TableCell>
                  <TableCell>
                    {`${item.volume} — ${item.volumeMax} ${
                      markets
                        ? markets.find((market) => market.id === item.marketId)
                            ?.mainCurrencyId
                        : null
                    }`}
                  </TableCell>
                  <TableCell>{item.user.answerRate}</TableCell>
                  <TableCell align="right">
                    <StyledButton
                      onClick={() =>
                        history.push(
                          generatePath('/advertisement/:id', {
                            id: item.id,
                          })
                        )
                      }
                      disabled={user?.id === item.user?.userId}
                    >
                      {isAskSide ? 'Купить' : 'Продать'}
                    </StyledButton>
                  </TableCell>
                </StyledTableRow>
              )}
              onHeadRowCell={(item) => (
                <StyledTableHeadCell>{item}</StyledTableHeadCell>
              )}
              maxHeight="700px"
              onChangePage={(page: number) => onChangePage(page)}
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="60px"
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

const StyledTableHeadCell = styled(TableCell)`
  background-color: #ffffff;
  font-size: 12px;
  line-height: 100%;
  color: ${(props) => props.theme.palette.secondary.dark};
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  border-radius: 32px;
  padding: 2px 12px;
  height: 32px;
  text-transform: none;
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
  }
  &:disabled {
    background-color: rgba(245, 245, 245, 1);
    color: #000000;
  }
`;

const Divider = styled(Box)`
  border-bottom: 1px solid #d9d9d9;
`;

const StyledTabsList = styled(TabsListUnstyled)`
  display: flex;
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

const SummIntervalTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    padding: '4px 0 5px',
  },
  '& fieldset.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export { Advertisements };
