/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import RoundedLayout from '../../components/RoundedLayout';
import View from '../../components/View';
import Toolbar from '../../components/Toolbar';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  useTheme,
} from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import useAppSelector from '../../hooks/useAppSelector';
import {
  getLastTrades,
  getMyTrades,
  selectLastTrades,
  selectMyTrades,
} from '../../store/tradeSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getWallets, selectWallets } from '../../store/walletSlice';
import { getMarkets, getMarketsExchange, MarketType, selectMarkets } from '../../store/marketSlice';
import {
  calcEffectivePrice,
  cancelOrder,
  createOrder,
  getMarket,
  getMyOrders,
  removeOrder,
  selectError,
  selectLoading,
  selectMarket,
  selectMyOrders,
  selectOrderCreated,
  setError,
} from '../../store/orderSlice';
import {
  getExternalSources,
  selectExternalSources,
} from '../../store/sourceSlice';
import usePopup from '../../hooks/usePopup';
import moment from 'moment';
import currency from 'currency.js';
import MinusCounterIcon from '../../icons/MinusCounterIcon.svg';
import PlusCounterIcon from '../../icons/PlusCounterIcon.svg';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'react-router';
import { Commission } from './Commission';
import { CourseIndicator } from './CourseIndicator';
import { FormField } from './FormField';
import { AlertPopup } from '../../components/AlertPopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import {
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
  tabUnstyledClasses,
} from '@mui/base';
import { styled } from '@mui/system';
import { StyledTable } from './StyledTable';
import { AskStyledTable } from './AskStyledTable';
import { BidStyledTable } from './BidStyledTable';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { AppDispatch } from '../../store';
import "./style.scss";

const Stock = () => {
  /** get user authentication flag */
  const { authenticated } = useAuth();
  /** popup management */
  const { setPopup } = usePopup();
  /** app dispatcher */
  const dispatch: AppDispatch = useAppDispatch();

  const theme = useTheme();

  /** error selector */
  const error = useAppSelector(selectError);

  const successOrderCreated = useAppSelector(selectOrderCreated);

  /** last trades selector */
  const lastTrades = useAppSelector(selectLastTrades);

  /** wallets selector */
  const wallets = useAppSelector(selectWallets);
  /** markets selector */
  const markets = useAppSelector(selectMarkets);

  /** loading indicator */
  const loading = useAppSelector(selectLoading);

  /** selected market id */
  const [marketId, setMarketId] = useState<string>();
  /** old stock course */
  const [oldPrice, setOldPrice] = useState<number>(0);
  /** new stock course */
  const [newPrice, setNewPrice] = useState<number>(0);

  const [isClearSelectedPercent, setIsClearSelectedPercent] =
    useState<boolean>(false);

  /** market selector */
  const market = useAppSelector(selectMarket);

  const [formTab, setFormTab] = useState<number>(0);

  /** my trades selector */
  const myTrades = useAppSelector(selectMyTrades);
  /** my orders selector */
  const myOrders = useAppSelector(selectMyOrders);

  /** stock tab */
  const [tab, setTab] = useState<number>(0);

  // external sources selector
  const externalSources = useAppSelector(selectExternalSources);

  /** bid volume */
  const [bidVolume, setBidVolume] = useState<number>(0);
  /** bid course */
  const [bidCourse, setBidCourse] = useState<number>(-1);
  /** bid fix price */
  const [bidFixPrice, setBidFixPrice] = useState<number>(0);
  /** bid factor */
  const [bidFactor, setBidFactor] = useState<number>(0);

  /** bid/ask summary input reference */
  const bidSummaryInputRef = createRef<HTMLInputElement>();
  const askSummaryInputRef = createRef<HTMLInputElement>();

  /** bid/ask volume input reference */
  const bidVolumeInputRef = createRef<HTMLInputElement>();
  const askVolumeInputRef = createRef<HTMLInputElement>();

  /** bid/ask course input reference */
  const bidCourseInputRef = createRef<HTMLInputElement>();
  const askCourseInputRef = createRef<HTMLInputElement>();

  /** ask volume */
  const [askVolume, setAskVolume] = useState<number>(0);
  /** bid volume */
  const [askCourse, setAskCourse] = useState<number>(-1);
  /** ask fix price */
  const [askFixPrice, setAskFixPrice] = useState<number>(0);
  /** ask factor */
  const [askFactor, setAskFactor] = useState<number>(0);

  /** ask commission */
  const [askCommission, setAskCommission] = useState(0);
  /** bid commission */
  const [bidCommission, setBidCommission] = useState(0);

  /** tick counter */
  const [tick, setTick] = useState<number>(0);

  const bidFactorInputRef = createRef<HTMLInputElement>();
  const askFactorInputRef = createRef<HTMLInputElement>();

  /**
   * selected market
   */
  const selectedMarket = useMemo(
    () => markets && markets.find((market) => market.id === marketId),
    [markets, marketId]
  );

  /**
   * wallet for main ops
   */
  const mainWallet = useMemo(
    () =>
      wallets &&
      selectedMarket &&
      wallets.find((wallet) => wallet.name === selectedMarket.mainCurrencyId),
    [wallets, selectedMarket]
  );

  /**
   * wallet for paid
   */
  const paidWallet = useMemo(
    () =>
      wallets &&
      selectedMarket &&
      wallets.find((wallet) => wallet.name === selectedMarket.paidCurrencyId),
    [wallets, selectedMarket]
  );

  const marketsByMarketId = useMemo(
    () => market && market.filter((market) => market.marketId === marketId),
    [market, marketId]
  );

  const ask = useMemo(
    () => marketsByMarketId[0]?.ask ?? [],
    [marketsByMarketId]
  );
  const bid = useMemo(
    () => marketsByMarketId[0]?.bid ?? [],
    [marketsByMarketId]
  );

  const askTotalVolume = useMemo(
    () =>
      ask.reduce(function (accumulator, currentAskItem) {
        return accumulator + Number(currentAskItem.volume);
      }, 0),
    [ask]
  );

  const bidTotalVolume = useMemo(
    () =>
      bid.reduce(function (accumulator, currentBidItem) {
        return accumulator + Number(currentBidItem.volume);
      }, 0),
    [bid]
  );

  /**
   * market list order
   */
  const marketListOrder = [
    'BTCRUB',
    'BTCUSDT',
    'ETHRUB',
    'ETHUSDT',
    'USDTRUB',
    'TRXUSDT',
  ];

  /**
   * market list order comparator function
   */
  const marketListOrderCompare = (a: MarketType, b: MarketType): number =>
    marketListOrder.indexOf(a.id) - marketListOrder.indexOf(b.id);

  /**
   * ordered market list
   */
  const markets2: MarketType[] = useMemo(
    () =>
      markets
        .filter((item) => marketListOrder.includes(item.id))
        .sort(marketListOrderCompare),
    [markets]
  );

  const refresh = () => {
    if (marketId) {
      setOldPrice(0);
      setNewPrice(0);

      // reset top panel tab to market
      setFormTab(0);

      // // reset bid and ask courses
      setBidCourse(-1);
      setAskCourse(-1);
      // // reset bid and ask fix prices
      setBidFixPrice(0);
      setAskFixPrice(0);
      setBidVolume(0);
      setAskVolume(0);

      if (bidCourseInputRef.current) {
        bidCourseInputRef.current.value = '';
      }

      if (askCourseInputRef.current) {
        askCourseInputRef.current.value = '';
      }

      calcEffectivePrices();

      // get courses
      //dispatch(getPrice(marketId));
      // get market
      dispatch(getMarket());
      // get my trades list
      dispatch(
        getMyTrades({
          page: 1,
          take: 10,
        })
      );
      // get my orders list
      dispatch(
        getMyOrders({
          page: 1,
          take: 10,
          marketId,
        })
      );

      // get last trades list
      dispatch(
        getLastTrades({
          page: 1,
          take: 10,
        })
      );
    }
  };

  /**
   * timer task
   */
  const timerTask = () => {
    // if (markets && markets2 && wallets && marketId) {
    //   //if (formTab !== 2) {
    //   //refresh();
    //   //}
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      timerTask()
      setTick(tick === 0 ? 1 : 0)
    }, 5000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    dispatch(setError(null));
    console.log(`get markets`);
    dispatch(getMarketsExchange());
  }, []);

  useEffect(() => {
    if (marketId) {
      console.log(`refresh`);
      refresh();
    }
  }, [marketId]);

  useEffect(() => {
    if (externalSources && externalSources.binance) {
      const bm = externalSources.binance.find(
        (market) => market.marketId === marketId
      );

      if (bm) {
        setBidCourse(parseFloat(bm.ask));
        setAskCourse(parseFloat(bm.bid));
      }
    }
  }, [externalSources]);

  /** error displaying */
  useEffect(() => {
    error &&
      setPopup(
        <ErrorPopup
          onClose={() => setPopup(null)}
          errorMessage={error.message}
        />
      );
  }, [error]);

  useEffect(() => {
    if (successOrderCreated) {
      if (askVolumeInputRef.current && askSummaryInputRef.current) {
        setAskVolume(0);
        askVolumeInputRef.current.value = '0';
        askSummaryInputRef.current.value = '0';
        setAskCommission(0);
      }
      if (bidVolumeInputRef.current && bidSummaryInputRef.current) {
        setBidVolume(0);
        bidVolumeInputRef.current.value = '0';
        bidSummaryInputRef.current.value = '0';
        setBidCommission(0);
      }

      refresh();
    }
  }, [successOrderCreated]);

  useEffect(() => {
    if (formTab !== 2) {
      if (askCourse && askCourseInputRef.current) {
        askCourseInputRef.current.value =
          askCourse <= 0 ? '' : askCourse.toString();
      }
      if (bidCourse && bidCourseInputRef.current) {
        bidCourseInputRef.current.value =
          bidCourse <= 0 ? '' : bidCourse.toString();
      }
      const _oldPrice = newPrice ? newPrice : 0;
      const _newPrice =
        (askCourse < 0 ? 0 : askCourse) + (bidCourse < 0 ? 0 : bidCourse);
      setOldPrice(_oldPrice);
      setNewPrice(askCourse <= 0 || bidCourse <= 0 ? _newPrice : _newPrice / 2);
      setBidFixPrice(bidCourse);
      setAskFixPrice(askCourse);
    }
  }, [askCourse, bidCourse, oldPrice, newPrice, formTab]);

  useEffect(() => {
    if (markets && markets2 && markets2.length) {
      console.log(`get wallets`);

      dispatch(getWallets());
    }
  }, [markets]);

  useEffect(() => {
    if (wallets && markets && markets2 && markets2.length) {
      console.log(`set market id`);
      setMarketId(markets2[0].id);
    }
  }, [wallets]);

  /**
   * market change handler
   */
  const onChangeMarket = useCallback((event: SelectChangeEvent<string>) => {
    setFormTab(0);

    setMarketId(event.target.value as string);
  }, []);

  /**
   * top panel tab handler
   */
  const onChangeFormTab = useCallback(
    (event: React.SyntheticEvent, newValue: string | number) => {
      const value = Number(newValue);

      setFormTab(value);

      switch (value) {
        case 0:
        case 1:
          // set bid and ask courses to 0
          setAskCourse(0);
          setBidCourse(0);

          // set bid and ask fix price to 0
          setBidFixPrice(0);
          setAskFixPrice(0);

          // clear bid and ask summary input values
          if (bidSummaryInputRef.current) bidSummaryInputRef.current.value = '';
          if (askSummaryInputRef.current) askSummaryInputRef.current.value = '';

          // set bid and ask commissions to 0
          setBidCommission(0);
          setAskCommission(0);

          // calc effective prices from server
          calcEffectivePrices();
          break;
        case 2:
          dispatch(getExternalSources());
          break;
      }
    },
    [marketId, bidSummaryInputRef, askSummaryInputRef]
  );

  const [bidSummary, setBidSummary] = useState<number>(0);
  const [askSummary, setAskSummary] = useState<number>(0);
  const computedBidCourse = useMemo(() => {
    let course = bidCourse || 0;
    if (formTab === 1) course = bidFixPrice;
    return course;
  }, [bidCourse, bidFixPrice, formTab]);

  const computedAskCourse = useMemo(() => {
    let course = askCourse || 0;
    if (formTab === 1) course = askFixPrice;
    return course;
  }, [askCourse, askFixPrice, formTab]);

  // Покупка крипты
  // Фиксированная цена (курс) покупки
  const onChangeBidFixPrice = useCallback(
    (value: number) => {
      console.log(`bid fix price changed`);
      if (paidWallet) {
        setBidSummary(bidVolume * value);
        setBidFixPrice(value);
      }
    },
    [bidVolume, paidWallet]
  );
  // Количество
  const onChangeBidVolume = useCallback(
    (value: number) => {
      console.log(`bid volume changed`);
      if (paidWallet) {
        const normalizedBidVolume = Math.min(
          paidWallet.service_balance / computedBidCourse,
          value
        );

        setBidVolume(normalizedBidVolume);

        const commission = parseFloat(
          ((normalizedBidVolume * 0.15) / 100).toFixed(4)
        );

        setBidSummary(normalizedBidVolume * computedBidCourse);

        setBidCommission(commission);
      }
    },
    [computedBidCourse, paidWallet]
  );
  // Сумма
  const onChangeBidSummary = useCallback(
    (value: number) => {
      console.log(`bid summary changed`);

      if (paidWallet) {
        const normalizedBidSummary = Math.min(
          paidWallet.service_balance,
          value
        );
        setBidSummary(normalizedBidSummary);

        const newBidVolume = normalizedBidSummary / computedBidCourse;

        setBidVolume(newBidVolume);

        const newCommission = (newBidVolume * 0.15) / 100;

        //console.log(newCommission)

        setBidCommission(newCommission);
      }
    },
    [paidWallet, bidVolume, computedBidCourse]
  );
  //
  const addBidVolumeByPercent = useCallback(
    (percent: number) => {
      if (paidWallet) {
        // исходя из выбранного процента вычисляем какое количество единиц на доступно для покупки
        const newBidVolume =
          ((paidWallet.service_balance / 100) * percent) / computedBidCourse;

        setBidVolume(newBidVolume);
      }
    },
    [paidWallet, computedBidCourse]
  );
  //
  const incrementBidFactor = useCallback(
    (_) => {
      const newBidFactor = parseFloat(
        (parseFloat(bidFactor.toFixed(2)) + 0.1).toFixed(2)
      );
      console.log(newBidFactor);
      setBidFactor(newBidFactor);
    },
    [bidFactor]
  );
  //
  const decrementBidFactor = useCallback(
    (_) => {
      const newBidFactor = parseFloat(
        (parseFloat(bidFactor.toFixed(2)) - 0.1).toFixed(2)
      );
      console.log(newBidFactor);
      setBidFactor(newBidFactor);
    },
    [bidFactor]
  );

  // Продажа крипты
  //
  const onChangeAskFixPrice = useCallback(
    (value: number) => {
      //if (value !== 0) {
      console.log(`ask fix price changed`);
      setAskFixPrice(value);
      setAskSummary(askVolume * value);
      //}
    },
    [askVolume]
  );

  const onChangeAskVolume = useCallback(
    (value: number) => {
      console.log(`ask volume changed`);
      if (mainWallet) {
        const newValue = Math.min(mainWallet.service_balance, value);
        setAskVolume(newValue);
        setAskSummary(newValue * computedAskCourse);
      }
    },
    [computedAskCourse, mainWallet]
  );

  const onChangeAskSummary = useCallback(
    (value: number) => {
      //if (value !== 0) {
      console.log(`ask summary changed`);
      const newAskVolume = value / computedAskCourse;
      setAskVolume(newAskVolume);
      setAskSummary(value);
      setAskCommission(parseFloat(((value * 0.15) / 100).toFixed(4)));
      //}
    },
    [computedAskCourse]
  );

  const addAskVolumeByPercent = useCallback(
    (percent: number) => {
      if (mainWallet) {
        const newAskVolume = (mainWallet.service_balance / 100) * percent;
        setAskVolume(newAskVolume);
      }
    },
    [mainWallet, computedAskCourse]
  );

  const incrementAskFactor = useCallback(
    (_) => {
      const newAskFactor = parseFloat(
        (parseFloat(askFactor.toFixed(2)) + 0.1).toFixed(2)
      );
      // debug
      console.log(newAskFactor);
      setAskFactor(newAskFactor);
    },
    [askFactor]
  );

  const decrementAskFactor = useCallback(
    (_) => {
      const newAskFactor = parseFloat(
        (parseFloat(askFactor.toFixed(2)) - 0.1).toFixed(2)
      );
      // debug
      console.log(newAskFactor);
      setAskFactor(newAskFactor);
    },
    [askFactor]
  );

  useEffect(() => {
    if (askFactor) {
      setAskSummary(
        (computedAskCourse + (computedAskCourse / 100) * askFactor) * askVolume
      );
    }
  }, []);

  useEffect(() => {
    if (bidFactor) {
      setBidSummary(
        (computedBidCourse + (computedBidCourse / 100) * bidFactor) * bidVolume
      );
    }
  }, []);

  /**
   * computed value
   */
  const orderType = useMemo(() => {
    switch (formTab) {
      case 0:
        return 'market';
      case 1:
        return 'limit';
      case 2:
        return 'limit:binance';
      case 3:
        return 'market:cross';
    }
  }, [formTab]);

  const onSubmit = useCallback(
    (side: string) => {
      if (marketId && orderType) {        
        dispatch(
          createOrder({
            market: marketId,
            orderType,
            side,
            by: 'volume',
            volume: `${side === 'bid' ? bidVolume : askVolume}`,
            amount: `${bidSummary}`,
            factor: `${(side === 'bid' ? bidFactor : askFactor) / 1000}`,
            fixPrice: `${side === 'bid' ? bidFixPrice : askFixPrice}`,
          })
        );

        calcEffectivePrices();
      }
    },
    [
      marketId,
      orderType,
      bidVolume,
      askVolume,
      bidFactor,
      askFactor,
      bidFixPrice,
      askFixPrice,
    ]
  );

  /**
   * effective prices
   */
  const calcEffectivePrices = async () => {
    console.log(`calc effective prices`);

    console.log(marketId);

    if (marketId) {
      // get bid course
      const { payload: askPrice } = await dispatch(
        calcEffectivePrice({
          side: 'ask',
          by: 'volume',
          volume: 1,
          amount: 0,
          marketId,
        })
      );
      // get ask course
      const { payload: bidPrice } = await dispatch(
        calcEffectivePrice({
          side: 'bid',
          by: 'volume',
          volume: 1,
          amount: 0,
          marketId,
        })
      );

      const askPriceFix = Number.isNaN(Number(askPrice as string))
        ? 0
        : parseFloat(askPrice as string);
      const bidPriceFix = Number.isNaN(Number(bidPrice as string))
        ? 0
        : parseFloat(bidPrice as string);

      // debug
      console.log(askPriceFix);
      console.log(bidPriceFix);

      setBidCourse(askPriceFix);
      setAskCourse(bidPriceFix);
    }
  };

  const onDeleteOrder = useCallback((orderId: string) => {
    setPopup(
      <AlertPopup
        title="Отмена заявки"
        closeable
        onClose={() => setPopup(null)}
        positiveButton="Подтвердить"
        onPositiveButtonClick={() => {
          setPopup(null);
          dispatch(cancelOrder(orderId));
          dispatch(removeOrder(orderId));
        }}
      />
    );
  }, []);

  /**
   * redirect to /path if user not logged
   */
  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          {markets &&
          marketId &&
          wallets &&
          selectedMarket &&
          mainWallet &&
          (askCourse >= 0 || bidCourse >= 0) &&
          paidWallet ? (
            <>
              <TopPanel
                sx={{
                  flexDirection: {
                    sm: 'column',
                    md: 'row',
                  },
                  gap: {
                    sm: '10px',
                    md: '0',
                  },
                  alignItems: {
                    sm: 'flex-start',
                    md: 'center',
                  },
                  justifyContent: {
                    sm: 'center',
                    md: 'space-between',
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap="10px">
                  <FormControl variant="standard">
                    <Select
                      className="select"
                      value={marketId}
                      onChange={onChangeMarket}
                      disableUnderline
                    >
                      {markets2.map((market) => (
                        <MenuItem value={market.id} key={market.id}>
                          {market.mainCurrencyId} / {market.paidCurrencyId}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box className="text">
                    <CourseIndicator
                      oldPrice={oldPrice ? oldPrice : 0}
                      newPrice={newPrice ? newPrice : 0}
                      currency={selectedMarket.paidCurrencyId}
                    />
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  style={{
                    overflowX: 'auto',
                  }}
                  sx={{
                    width: {
                      sm: '100%',
                      md: 'auto',
                    },
                  }}
                >
                  <TabsUnstyled value={formTab} onChange={onChangeFormTab}>
                    <StyledTabsList>
                      <TopPanelTab className="price__of_market">Цена по рынку</TopPanelTab>
                      <TopPanelTab className="other__prices">Фиксированная цена</TopPanelTab>
                      <TopPanelTab className="other__prices">Binance ±%</TopPanelTab>
                      <TopPanelTab className="other__prices">Перекрестная цена по рынку</TopPanelTab>
                    </StyledTabsList>
                  </TabsUnstyled>
                </Box>
              </TopPanel>
              <Row
                sx={{
                  flexDirection: {
                    sm: 'column',
                    md: 'row',
                  },
                }}
              >
                {/** Форма покупки */}
                <Col
                  sx={{
                    width: {
                      sm: '100%',
                      md: '50%',
                    },
                  }}
                >
                  <ColLayout>
                    <Box display="flex" justifyContent="space-between">
                      <Box fontWeight="bold"  >
                       <div className="__name">
                         Купить {selectedMarket.mainCurrencyId}
                       </div>
                      </Box>
                      <Box display="flex" gap="10px">
                        <Box color="#717779">Баланс:</Box>
                        <Box>
                          {currency(paidWallet.service_balance, {
                            separator: ' ',
                            pattern: '#',
                            precision: 6,
                          }).format()}
                        </Box>
                        <Box fontWeight="bold">{paidWallet.name}</Box>
                      </Box>
                    </Box>

                    <Box>
                      <FormField label="Количество:">
                       <div className="__wss">
                         <FormField>
                           <Commission
                               onChanged={(value: number) => {
                                 console.log('prectnt', value)
                                 addBidVolumeByPercent(value)
                               }
                               }
                           />
                         </FormField>
                       </div>
                        <NumberFormat
                            thousandsGroupStyle="thousand"
                            decimalSeparator="."
                            displayType="input"
                            thousandSeparator=" "
                            allowNegative={false}
                            allowLeadingZeros={true}
                            onValueChange={(values: NumberFormatValues) => {
                              const { floatValue } = values;
                              const floatValueFix = floatValue ? floatValue : 0;
                              onChangeBidVolume(floatValueFix);
                            }}
                            value={bidVolume === 0 ? '' : bidVolume}
                            style={{
                              padding: '0px 14px',
                              width: '100%',
                              border: 0,
                              borderBottom:
                                  '2px solid ' + "#C8D6DC",
                              boxSizing: 'border-box',
                              outline:"none",
                            }}
                        />
                      </FormField>
                      <FormField label="Курс:">
                        {formTab === 0 && (
                          <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                            gap="10px"
                          >
                            <Box flex="1">
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator=" "
                                allowLeadingZeros={true}
                                disabled={true}
                                value={bidCourse === 0 ? '' : bidCourse}
                                style={{
                                  padding: '16px 14px',
                                  width: '100%',
                                  border: 0,
                                  borderBottom:
                                      '2px solid ' + "#C8D6DC",
                                  boxSizing: 'border-box',
                                  background:'white',
                                  outline:"none",
                                }}
                              />
                            </Box>
                            <Box color="#696969">{paidWallet.name}</Box>
                          </Box>
                        )}

                        {formTab === 1 && (
                          <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                            gap="10px"
                          >
                            <Box flex="1">
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator=" "
                                allowLeadingZeros={true}
                                onValueChange={(values: NumberFormatValues) => {
                                  const { floatValue } = values;
                                  const floatValueFix = floatValue
                                    ? floatValue
                                    : 0;

                                  onChangeBidFixPrice(floatValueFix);
                                }}
                                value={bidFixPrice === 0 ? '' : bidFixPrice}
                                style={{
                                  padding: '16px 14px',
                                  width: '100%',
                                  border: 0,
                                  borderBottom:
                                      '2px solid ' + "#C8D6DC",
                                  boxSizing: 'border-box',
                                  background:'white',
                                  outline:"none",
                                }}
                                placeholder="Укажите курс"
                                allowNegative={false}
                              />
                            </Box>
                            <Box color="#696969">{paidWallet.name}</Box>
                          </Box>
                        )}

                        {formTab === 2 && (
                          <Box display="flex" alignItems="center">
                            <Box flex="1" display="flex" gap="5px">
                              <Box flex="1">
                                <NumberFormat
                                  thousandsGroupStyle="thousand"
                                  decimalSeparator="."
                                  displayType="input"
                                  thousandSeparator=" "
                                  allowNegative={true}
                                  allowLeadingZeros={true}
                                  disabled={true}
                                  value={bidFactor}
                                  style={{
                                    padding: '16px 14px',
                                    width: '100%',
                                    border: 0,
                                    borderBottom:
                                        '2px solid ' + "#C8D6DC",
                                    boxSizing: 'border-box',
                                    background:'white',
                                    outline:"none",
                                  }}
                                  suffix="%"
                                />
                              </Box>
                              <Box display="flex" gap="2px" alignItems="center">
                                <IconButton
                                  onClick={incrementBidFactor}
                                  style={{
                                    minWidth: 'fit-content',
                                    padding: '0',
                                  }}
                                >
                                  <img src={PlusCounterIcon} alt="" />
                                </IconButton>
                                <IconButton
                                  onClick={decrementBidFactor}
                                  style={{
                                    minWidth: 'fit-content',
                                    padding: '0',
                                  }}
                                >
                                  <img src={MinusCounterIcon} alt="" />
                                </IconButton>
                              </Box>
                            </Box>

                            <TextField
                              fullWidth
                              style={{
                                flex: '1',
                                padding: '16px 14px',
                              }}
                              InputProps={{
                                endAdornment: <>{paidWallet.name}</>,
                              }}
                              disabled
                              value={askCourse}
                              variant="standard"
                            />
                          </Box>
                          )}

                        {formTab === 3 && (
                          <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                            gap="10px"
                          >
                            <Box flex="1">
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator=" "
                                allowLeadingZeros={true}
                                disabled={true}
                                value={bidCourse === 0 ? '' : bidCourse}
                                style={{
                                  padding: '16px 14px',
                                  width: '100%',
                                  border: 0,
                                  borderBottom:
                                      '2px solid ' + "#C8D6DC",
                                  boxSizing: 'border-box',
                                  background:'white',
                                  outline:"none",
                                }}
                              />
                            </Box>
                            <Box color="#696969">{paidWallet.name}</Box>
                          </Box>
                        )}
                        
                      </FormField>

                      <FormField label="Всего:">
                        <NumberFormat
                          thousandsGroupStyle="thousand"
                          decimalSeparator="."
                          displayType="input"
                          thousandSeparator=" "
                          allowNegative={false}
                          allowLeadingZeros={true}
                          onValueChange={(values: NumberFormatValues) => {
                            const { floatValue } = values;
                            const floatValueFix = floatValue ? floatValue : 0;
                            onChangeBidSummary(floatValueFix);
                          }}
                          value={bidSummary === 0 ? '' : bidSummary}
                          style={{
                            padding: '16px 14px',
                            width: '100%',
                            border: 0,
                            borderBottom:
                                '2px solid ' + "#DA2B90",
                            boxSizing: 'border-box',
                            background:'white',
                            outline:'none'
                          }}
                        />
                      </FormField>
                      <div className="_divleft">
                        <FormField label="Комиссия:">
                          <div className="__commisia">
                            <Box display="flex" justifyContent="space-between">
                              <Box display="flex" alignItems="center" gap="5px">
                                <Box fontWeight="bold">
                                  {currency(bidCommission.toFixed(4), {
                                    separator: ' ',
                                    pattern: '#',
                                    precision: 6,
                                  }).format()}
                                </Box>
                                <Box fontWeight="bold">{mainWallet.name}</Box>
                                <Box>(0.15%)</Box>
                              </Box>
                              <Box>
                                <Button
                                    className="btn__buy"
                                    disabled={
                                        ((!bidCourse || bidCourse <= 0) &&
                                            !bidFixPrice) ||
                                        !bidVolume ||
                                        bidVolume <= 0
                                    }
                                    onClick={() => onSubmit('bid')}
                                >
                                  Купить
                                </Button>
                              </Box>
                            </Box>
                          </div>
                        </FormField>
                      </div>
                    </Box>
                  </ColLayout>
                </Col>

                {/** Форма продажи */}
                <Col
                  sx={{
                    width: {
                      sm: '100%',
                      md: '50%',
                    },
                    borderLeft: {
                      sm: '0',
                      md: '1px solid #dce5e9',
                    },
                  }}
                >
                  <ColLayout>
                    <Box display="flex" justifyContent="space-between">
                      <Box fontWeight="bold">
                        <div className="__name">
                          Продать {selectedMarket.mainCurrencyId}
                        </div>
                      </Box>
                      <Box display="flex" gap="10px">
                        <Box color="#717779">Баланс:</Box>
                        <Box>
                          {currency(mainWallet.service_balance, {
                            separator: ' ',
                            pattern: '#',
                            precision: 6,
                          }).format()}
                        </Box>
                        <Box fontWeight="bold">{mainWallet.name}</Box>
                      </Box>
                    </Box>
                    <Box>
                      <FormField label="Количество:">
                       <div className="__wss">
                         <FormField>
                           <Commission
                               onChanged={(value: number) =>
                                   addAskVolumeByPercent(value)
                               }
                           />
                         </FormField>
                       </div>
                        <NumberFormat
                            thousandsGroupStyle="thousand"
                            decimalSeparator="."
                            displayType="input"
                            thousandSeparator=" "
                            allowNegative={false}
                            allowLeadingZeros={true}
                            onValueChange={(values: NumberFormatValues) => {
                              const { floatValue } = values;
                              const floatValueFix = floatValue ? floatValue : 0;
                              onChangeAskVolume(floatValueFix);
                            }}
                            value={askVolume === 0 ? '' : askVolume}
                            style={{
                              padding: '0px 14px',
                              width: '100%',
                              border: 0,
                              borderBottom:
                                  '2px solid ' + "#C8D6DC",
                              boxSizing: 'border-box',
                              background:'white',
                              outline:"none",
                            }}
                        />
                      </FormField>
                      <FormField label="Курс:">
                        {formTab === 0 && (
                          <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                            gap="10px"
                          >
                            <Box flex="1">
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator=" "
                                allowLeadingZeros={true}
                                disabled={true}
                                value={askCourse === 0 ? '' : askCourse}
                                style={{
                                  padding: '16px 14px',
                                  width: '100%',
                                  border: 0,
                                  borderBottom:
                                      '2px solid ' + "#C8D6DC",
                                  boxSizing: 'border-box',
                                  background:'white',
                                  outline:"none",
                                }}
                              />
                            </Box>
                            <Box color="#696969">{paidWallet.name}</Box>
                          </Box>
                        )}

                        {formTab === 1 && (
                          <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                            gap="10px"
                          >
                            <Box flex="1">
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator=" "
                                allowNegative={false}
                                allowLeadingZeros={true}
                                onValueChange={(values: NumberFormatValues) => {
                                  const { floatValue } = values;
                                  const floatValueFix = floatValue
                                    ? floatValue
                                    : 0;
                                  onChangeAskFixPrice(floatValueFix);
                                }}
                                value={askFixPrice === 0 ? '' : askFixPrice}
                                style={{
                                  padding: '16px 14px',
                                  width: '100%',
                                  border: 0,
                                  borderBottom:
                                      '2px solid ' + "#C8D6DC",
                                  boxSizing: 'border-box',
                                  background:'white',
                                  outline:"none",
                                }}
                                placeholder="Укажите курс"
                              />
                            </Box>

                            <Box color="#696969">{paidWallet.name}</Box>
                          </Box>
                        )}

                        {formTab === 2 && (
                          <Box display="flex" alignItems="center">
                            <Box flex="1" display="flex" gap="5px">
                              <Box flex="1">
                                <NumberFormat
                                  thousandsGroupStyle="thousand"
                                  decimalSeparator="."
                                  displayType="input"
                                  thousandSeparator=" "
                                  allowNegative={true}
                                  allowLeadingZeros={true}
                                  disabled={true}
                                  value={askFactor}
                                  style={{
                                    padding: '16px 14px',
                                    width: '100%',
                                    border: 0,
                                    borderBottom:
                                        '2px solid ' + "#C8D6DC",
                                    boxSizing: 'border-box',
                                    background:'white',
                                    outline:"none",
                                  }}
                                  suffix="%"
                                />
                              </Box>
                              <Box display="flex" gap="2px" alignItems="center">
                                <IconButton
                                  onClick={incrementAskFactor}
                                  style={{
                                    minWidth: 'fit-content',
                                    padding: '0',
                                  }}
                                >
                                  <img src={PlusCounterIcon} alt="" />
                                </IconButton>
                                <IconButton
                                  onClick={decrementAskFactor}
                                  style={{
                                    minWidth: 'fit-content',
                                    padding: '0',
                                  }}
                                >
                                  <img src={MinusCounterIcon} alt="" />
                                </IconButton>
                              </Box>
                            </Box>
                            <TextField
                              fullWidth
                              style={{
                                flex: '1',
                                padding: '16px 14px',
                              }}
                              InputProps={{
                                endAdornment: <>{paidWallet.name}</>,
                              }}
                              disabled
                              value={askCourse}
                              variant="standard"
                            />
                          </Box>
                          )}
                          
                        {formTab === 3 && (
                          <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                            gap="10px"
                          >
                            <Box flex="1">
                              <NumberFormat
                                thousandsGroupStyle="thousand"
                                decimalSeparator="."
                                displayType="input"
                                thousandSeparator=" "
                                allowLeadingZeros={true}
                                disabled={true}
                                value={bidCourse === 0 ? '' : bidCourse}
                                style={{
                                  padding: '16px 14px',
                                  width: '100%',
                                  border: 0,
                                  borderBottom:
                                      '2px solid ' + "#C8D6DC",
                                  boxSizing: 'border-box',
                                  background:'white',
                                  outline:"none",
                                }}
                              />
                            </Box>
                            <Box color="#696969">{paidWallet.name}</Box>
                          </Box>
                        )}
                      </FormField>

                      <FormField label="Всего:">
                        <NumberFormat
                          thousandsGroupStyle="thousand"
                          decimalSeparator="."
                          displayType="input"
                          thousandSeparator=" "
                          allowNegative={false}
                          allowLeadingZeros={true}
                          onValueChange={(values: NumberFormatValues) => {
                            const { floatValue } = values;
                            const floatValueFix = floatValue ? floatValue : 0;
                            onChangeAskSummary(floatValueFix);
                          }}
                          value={askSummary === 0 ? '' : askSummary}
                          style={{
                            padding: '16px 14px',
                            width: '100%',
                            border: 0,
                            borderBottom:
                              '2px solid ' + "#C8D6DC",
                            boxSizing: 'border-box',
                            background:'white',
                            outline:"none",
                          }}
                        />
                      </FormField>
                     <div className="_divleft">
                       <FormField label="Комиссия:">
                         <div className="__commisia">
                           <Box display="flex" justifyContent="space-between">
                             <Box display="flex" alignItems="center" gap="5px">
                               <Box fontWeight="bold">
                                 {currency(askCommission.toFixed(4), {
                                   separator: ' ',
                                   pattern: '#',
                                   precision: 6,
                                 }).format()}
                               </Box>
                               <Box fontWeight="bold">{paidWallet.name}</Box>
                               <Box>(0.15%)</Box>
                             </Box>
                             <Box>
                               <Button
                                   className="__prodat"
                                   disabled={
                                       ((!askCourse || askCourse <= 0) &&
                                           !askFixPrice) ||
                                       !askVolume ||
                                       askVolume <= 0
                                   }
                                   onClick={() => onSubmit('ask')}
                               >
                                 Продать
                               </Button>
                             </Box>
                           </Box>
                         </div>
                       </FormField>
                     </div>
                    </Box>
                  </ColLayout>
                </Col>
              </Row>
              {/** Продажа XXX | Покупка XXX */}
              <Row
                sx={{
                  flexDirection: {
                    sm: 'column',
                    md: 'row',
                  },
                }}
              >
                <Col
                  sx={{
                    width: {
                      sm: '100%',
                      md: '50%',
                    },
                  }}
                >
                  <ColLayout>
                    <Box fontWeight="bold" className="__name">
                      Продажа {selectedMarket.mainCurrencyId}
                    </Box>
                    <AskStyledTable
                      heads={[
                        {
                          key: 'price',
                          title: `Курс ${mainWallet.name}`,
                        },
                        {
                          key: 'volume',
                          title: `Количество ${mainWallet.name}`,
                        },
                        {
                          key: 'amount',
                          title: `Всего ${paidWallet.name}`,
                        },
                      ]}
                      rows={ask.map((item) => {
                        const obj: any = {
                          ...item,
                          __progress:
                            100 / (askTotalVolume / Number(item.volume)),
                        };

                        return obj;
                      })}
                    />
                  </ColLayout>
                </Col>
                <Col
                  sx={{
                    width: {
                      sm: '100%',
                      md: '50%',
                    },
                    borderLeft: {
                      sm: '0',
                      md: '1px solid #dce5e9',
                    },
                  }}
                >
                  <ColLayout>
                    <Box fontWeight="bold" className="__name">
                      Покупка {selectedMarket.mainCurrencyId}
                    </Box>
                    <BidStyledTable
                      heads={[
                        {
                          key: 'price',
                          title: `Курс ${mainWallet.name}`,
                        },
                        {
                          key: 'volume',
                          title: `Количество ${mainWallet.name}`,
                        },
                        {
                          key: 'amount',
                          title: `Всего ${paidWallet.name}`,
                        },
                      ]}
                      rows={bid.map((item) => {
                        const obj: any = {
                          ...item,
                          __progress:
                            100 / (bidTotalVolume / Number(item.volume)),
                        };

                        return obj;
                      })}
                    />
                  </ColLayout>
                </Col>
              </Row>
              {/** Последние сделки | Покупка XXX */}
              <Row
                sx={{
                  flexDirection: {
                    sm: 'column',
                    md: 'row',
                  },
                }}
              >
                <Col
                  sx={{
                    width: {
                      sm: '100%',
                      md: '50%',
                    },
                  }}
                >
                  <ColLayout>
                    <Box fontWeight="bold" style={{marginBottom:'15px'}}> <span className="__name">Последние сделки </span></Box>
                    {lastTrades && (
                      <StyledTable
                        heads={[
                          {
                            key: 'amount',
                            title: 'Цена',
                          },
                          {
                            key: 'price',
                            title: `Объём ${mainWallet.name}`,
                          },
                          {
                            key: 'volume',
                            title: `Объём ${paidWallet.name}`,
                          },
                          {
                            key: '__side',
                            title: 'Покупка  Продажа',
                          },
                          {
                            key: '__date',
                            title: 'Дата  Время',
                          },
                        ]}
                        rows={lastTrades
                          .filter((trade) => trade.marketId === marketId)
                          .map((item) => {
                            const obj: any = {
                              ...item,
                              __side:
                                item.side === 'ask' ? 'Покупка' : 'Продажа',
                              __date: (
                                <Box textAlign="center" display='flex'>
                                  <Box fontSize="10px" style={{marginLeft:'25px'}}>
                                    {moment(item.created_at).format('HH:mm')}
                                  </Box>
                                  <Box color="#666666" style={{marginLeft:'5px'}}>
                                    {moment(item.created_at).format(
                                      'DD.MM.YYYY'
                                    )}
                                  </Box>
                                </Box>
                              ),
                            };
                            return obj;
                          })}
                      />
                    )}
                  </ColLayout>
                </Col>
                <Col
                  sx={{
                    width: {
                      sm: '100%',
                      md: '50%',
                    },
                    borderLeft: {
                      sm: '0',
                      md: '1px solid #dce5e9',
                    },
                  }}
                >
                  <ColLayout>
                    <TabsUnstyled
                      value={tab}
                      onChange={(
                        event: React.SyntheticEvent,
                        newValue: string | number
                      ) => {
                        setTab(Number(newValue));
                      }}
                    >
                      <StyledTabsList>
                        <StyledPureTab>Мои обмены</StyledPureTab>
                        <StyledPureTab>Мои заявки</StyledPureTab>
                      </StyledTabsList>
                    </TabsUnstyled>

                    {tab === 0 && (
                      <StyledTable
                        heads={[
                          {
                            key: 'price',
                            title: 'Курс',
                          },
                          {
                            key: 'volume',
                            title: `Объём ${mainWallet.name}`,
                          },
                          {
                            key: 'amount',
                            title: `Объём ${paidWallet.name}`,
                          },
                          {
                            key: '__side',
                            title: 'Покупка  Продажа',
                          },
                          {
                            key: '__date',
                            title: 'Дата  Время',
                          },
                        ]}
                        rows={myTrades
                          .filter((item) => item.marketId === marketId)
                          .map((item) => {
                            const obj: any = {
                              ...item,
                              __side:
                                item.side === 'ask' ? 'Продажа' : 'Покупка',
                              __date: (
                                  <Box textAlign="center" display='flex'>
                                    <Box fontSize="10px" style={{marginLeft:'25px'}}>
                                      {moment(item.created_at).format('HH:mm')}
                                    </Box>
                                    <Box color="#666666" style={{marginLeft:'5px'}}>
                                      {moment(item.created_at).format(
                                          'DD.MM.YYYY'
                                      )}
                                    </Box>
                                  </Box>
                              ),
                            };
                            return obj;
                          })}
                      />
                    )}

                    {tab === 1 && (
                      <StyledTable
                        heads={[
                          {
                            key: 'price',
                            title: 'Курс',
                          },
                          {
                            key: 'volume',
                            title: `Объём ${mainWallet.name}`,
                          },
                          {
                            key: 'amount',
                            title: `Объём ${paidWallet.name}`,
                          },
                          {
                            key: '__side',
                            title: 'Покупка  Продажа',
                          },
                          {
                            key: '__date',
                            title: 'Дата  Время',
                          },
                          {
                            key: '__actions',
                            title: '',
                          },
                        ]}
                        rows={myOrders.map((item) => {
                          const obj: any = {
                            ...item,
                            __side: item.side === 'ask' ? 'Продажа' : 'Покупка',
                            __date: (
                                <Box textAlign="center" display='flex'>
                                  <Box fontSize="10px" style={{marginLeft:'25px'}}>
                                    {moment(item.created_at).format('HH:mm')}
                                  </Box>
                                  <Box color="#666666" style={{marginLeft:'5px'}}>
                                    {moment(item.created_at).format(
                                        'DD.MM.YYYY'
                                    )}
                                  </Box>
                                </Box>
                            ),
                            __actions: (
                              <Box>
                                <Button
                                  onClick={() => onDeleteOrder(item.orderId)}
                                >
                                  Отменить
                                </Button>
                              </Box>
                            ),
                          };
                          return obj;
                        })}
                      />
                    )}
                  </ColLayout>
                </Col>
              </Row>
            </>
          ) : (
            <LoadingLayout>
              <CircularProgress />
            </LoadingLayout>
          )}
        </RoundedLayout>
      </Container>
    </View>
  );
};

const TopPanel = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  border-bottom: 1px solid #dce5e9;
`;

const TopPanelTab = styled(TabUnstyled)`
  background-color: #f5f5f5;
  color: #000000;
  border: 2px solid transparent;
  padding: 7px 15px;
  cursor: pointer;
  border-radius: 36px;
  font-size: 16px;
  &.${tabUnstyledClasses.selected} {
    background-color: #ffffff;
    border-color: #cba977;
    color: #cba977;
  }
`;

const Row = styled(Box)`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #dce5e9;
`;

const Col = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ColLayout = styled(Box)`
  margin: 30px;
`;

const LoadingLayout = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
`;

const StyledPureTab = styled(TabUnstyled)`
  color: #9e9e9e;
  font-size: 16px;
  border: 0;
  margin-bottom: 15px;
  background-color: #ffffff;
  cursor: pointer;
  &.${tabUnstyledClasses.selected} {
    color: #000000;
    font-weight: bold;
  }
`;

const StyledTabsList = styled(TabsListUnstyled)`
  display: flex;
  gap: 10px;
  font-family: Montserrat, sans-serif
`;

export default Stock;
