import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import RoundedLayout from '../../components/RoundedLayout';
import View from '../../components/View';
import LockedIcon from '../../icons/LockedIcon.svg';
import Replenish from './Replenish';
import Withdraw from './Withdraw';
import useAppSelector from '../../hooks/useAppSelector';
import {
  getSummary,
  getWallets,
  selectSummary,
  getCurrencyList,
  selectSummaryUpdated,
  selectWallets,
  selectCurrencyList,
  WalletType,
} from '../../store/walletSlice';
import Toolbar from '../../components/Toolbar';
import WalletIcon from '../../icons/WalletIcon.svg';
import ReplenishHistory from './ReplenishHistory';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'react-router';
import {
  Box,
  CircularProgress,
  Container,
  styled,
  useTheme,
} from '@mui/material';
import currency from 'currency.js';
import BTC from '../../icons/BTC.svg';
import ETH from '../../icons/ETH.svg';
import USDT from '../../icons/USDT.svg';
import RUB from '../../icons/RUB.svg';
import EUR from '../../icons/EUR.svg';
import USDC from '../../icons/USDC.svg';
import USD from '../../icons/USD.svg';
import TRX from '../../icons/TRX.svg';
import TRRB from '../../icons/TRRB.svg';
import TMC from '../../icons/TMC.svg'
import useAppDispatch from '../../hooks/useAppDispatch';
import { AppDispatch } from '../../store';
import TabsSwitcher from '../../components/TabsSwitcher';

const Actives = () => {
  const { authenticated } = useAuth();
  const theme = useTheme();
  const [tab, setTab] = useState<number>(0);
  const wallets = useAppSelector(selectWallets);
  const summary = useAppSelector(selectSummary);
  const currencyList = useAppSelector(selectCurrencyList);
  const summaryUpdated = useAppSelector(selectSummaryUpdated);
  const [selectedWallet, setSelectedWallet] = useState<
    WalletType | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useAppDispatch();

  /**
   * find currency list
   */

  function currencyAccordance(name: string): any {
    return currencyList.find((e: any) => e.id === name)
  }

  /**
   * Wallets enum
   */
  enum CurrencyTicker {
    TRRB = "TRRB",
    BTC = "BTC",
    ETH = "ETH",
    USDT = "USDT",
    TRX = "TRX",
    RUB = "RUB",
  }

  /**
   * summary currency for display in sidebar card
   */
  const summaryCurrency = 'RUB';

  /**
   * wallets order
   */
  const walletsOrder = ['TRRB', 'BTC', 'ETH', 'USDT', 'TRX', 'RUB'];

  /**
   * wallets order comparator
   */
  const walletsOrderComparator = (a: WalletType, b: WalletType): number =>
    walletsOrder.indexOf(a.currency_id) - walletsOrder.indexOf(b.currency_id);

  /**
   * excluded wallets
   */
  // const excludedWallets = ['USDC'];

  useEffect(() => {
    dispatch(getWallets());
    dispatch(getCurrencyList());
    dispatch(getSummary(summaryCurrency));
  }, []);

  /**
   * wallet click listener
   */
  const onWalletClick = useCallback(
    (wallet) => {
      if (!loading && selectedWallet !== wallet) {
        setLoading(true);

        setTab(0);

        if (selectedWallet) {
          setTimeout(() => {
            setSelectedWallet(wallet);
            setLoading(false);
          }, 500);
        } else {
          setSelectedWallet(wallet);
          setLoading(false);
        }
      }
    },
    [selectedWallet, loading]
  );

  /**
   * currency icon for display
   */
  const currencyIcon: {
    [index: string]: string;
  } = {
    btc: BTC,
    eth: ETH,
    usd: USD,
    rub: RUB,
    eur: EUR,
    trx: TRX,
    usdt: USDT,
    usdc: USDC,
    trrb: TRRB,
    tmc: TMC
  };

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <Box
            display="flex"
            gap="10px"
            sx={{
              flexDirection: {
                sm: 'column',
                lg: 'row'
              },
              padding: '24px',
            }}
          >
            <Box sx={{
              flex: {
                sm: '0.3',
              },
              borderBottom: {
                sm: '1px solid #D9D9D9',
                lg: 'none',
              },
              paddingBottom: {
                sm: '10px',
              },
              marginBottom: {
                md: '10px'
              },
              width: {
                //lg: '267px'
              }
            }}>
              <Box display="flex">
                <Box height='52px'
                  width='52px'
                  borderRadius='12px'
                  bgcolor='#fff8f2'
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                >
                  <img src={WalletIcon} alt="" />
                </Box>

                <Box
                  display='flex'
                  flexDirection='column'
                  ml='15px'
                  mb='43px'
                >
                  <Box
                    fontWeight='600'
                    fontSize='18px'
                    lineHeight='26px'
                  >
                    {summary
                      ? currency(summary, {
                        separator: ' ',
                        pattern: '#',
                        precision: currencyAccordance(CurrencyTicker.RUB)?.precision,
                      }).format()
                      : 0}
                    {' '} {summaryCurrency}
                  </Box>
                  <Box
                    fontSize='14px'
                    lineHeight='21px'
                    color={theme.palette.secondary.dark}
                  >
                    {moment(summaryUpdated).format('D.M.YYYY HH:mm:ss')}
                  </Box>
                </Box>
              </Box>

              <Box
                display="flex"
                sx={{
                  flexDirection: {
                    sm: 'row',
                    lg: 'column'
                  },
                  gap: {
                    md: '20px',
                    lg: '10px'
                  }
                }}
                style={{
                  width: '100%',
                  overflowX: 'auto',
                  paddingBottom: '10px',
                }}
              >
                {[...wallets]
                  .sort(walletsOrderComparator)
                  .map((wallet, index) => (
                    <WalletCard
                      key={wallet.currency_id!!}
                      onClick={() => onWalletClick(wallet)}
                      style={{
                        border:
                          selectedWallet?.currency_id == wallet.currency_id ? '2px solid #cba977' : '',
                      }}
                    >
                      <Box
                        width='52px'
                        borderRadius='12px'
                        height='52px'
                        bgcolor={theme.palette.secondary.light}
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={currencyIcon[wallet.name.toLowerCase()]}
                          alt=""
                          style={{
                            width: '24px'
                          }}
                        />
                      </Box>

                      <Box display="flex" flexDirection="column" gap="10px">
                        <Box fontWeight="500" fontSize="15px">
                          {
                            wallet.service_balance
                              ? currency(wallet.service_balance, {
                                separator: ' ',
                                pattern: '#',
                                precision: currencyAccordance(wallet.currency_id)?.precision
                              }).format()
                              : 0
                          }
                          {' '} {wallet.name}
                        </Box>

                        <Box display="flex">
                          <img
                            alt=""
                            style={{ marginRight: '6px' }}
                            src={LockedIcon}
                          />
                          <Box fontSize="13px" color="#696969">
                            {currency(wallet.held_balance || 0 , {
                              separator: ' ',
                              pattern: '#',
                              precision: currencyAccordance(wallet.currency_id)?.precision
                            }).format()}
                          </Box>
                        </Box>
                      </Box>
                    </WalletCard>
                  ))}
              </Box>
            </Box>

            <Box
              sx={{
                paddingLeft: {
                  sm: '0px',
                  lg: '30px',
                },
                borderLeft: {
                  sm: 'none',
                  lg: '1px solid #d9d9d9'
                },
                paddingTop: {
                  sm: '15px',
                  md: '0px',
                },
                flex: {
                  sm: '0.7'
                }
              }}
            >
              {selectedWallet ? (
                loading ? (
                  <LoadingLayout>
                    <CircularProgress />
                  </LoadingLayout>
                ) : (
                  <>
                    <TabsSwitcher
                      items={[`Пополнить ${selectedWallet.currency_id}`, `Вывести ${selectedWallet.currency_id}`]}
                      onChanged={(value) => setTab(value)}
                      defaultValue={tab}
                    />
                    <Box sx={{
                      paddingTop: {
                        sm: '20px'
                      },
                      borderBottom: '1px solid #D9D9D9',
                      paddingBottom: {
                        sm: '24px',
                        md: '0px',
                      }
                    }}
                    >
                      {tab === 0 && (
                        <Replenish selectedWallet={selectedWallet} />
                      )}
                      {tab === 1 && (
                        <Withdraw selectedWallet={selectedWallet} />
                      )}
                    </Box>

                    {selectedWallet && selectedWallet.name !== 'RUB' && (
                      <ReplenishHistory
                        selectedWallet={selectedWallet}
                        tabIndex={tab}
                      />
                    )}
                  </>
                )
              ) : (
                <Box
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="24px"
                  color="#999999"
                >
                  {!!wallets.length && <>Выберите кошелёк</>}
                  {!wallets.length && <div> Кошельки отсутствуют</div>}
                </Box>
              )}
            </Box>
          </Box>
        </RoundedLayout>
      </Container>
    </View >
  );
};

const LoadingLayout = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const WalletCard = styled(Box)`
  cursor: pointer;
  margin-top: 5px;
  display: flex;
  border: 1px solid transparent;
  border-radius: 20px;
  box-sizing: border-box;
  align-items: center;
  min-width: 200px;
  gap: 10px;
  padding: 8px;
  &:hover {
    border: 1px solid #D9D9D9;
  }
`;

export default Actives;
