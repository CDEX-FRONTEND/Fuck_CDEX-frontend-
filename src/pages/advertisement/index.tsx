import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import RoundedLayout from '../../components/RoundedLayout';
import View from '../../components/View';
import CompleteDealIcon from '../../icons/CompletedDealIconGold.svg';
import TimerIcon from '../../icons/TimerIconGold.svg';
import ClipIcon from '../../icons/ClipIcon.svg';
import CloseIcon from '../../icons/CloseIcon.svg';
import MessageSendIcon from '../../icons/MessageSendIconGold.svg';
import autosize from 'autosize';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  getMarkets,
  getMarketsOtc,
  selectMarkets,
} from '../../store/marketSlice';
import {
  cancelTrade,
  confirmTrade,
  getAdvertisement,
  getAdvertisementChat,
  getPaymentMethods,
  getTradeInfo,
  getTradeStatus,
  openWaitConfirmTrade,
  selectAdvertisement,
  selectAdvertisementChat,
  sendPaymentDetailsTrade,
  sendPaymentDocumentTrade,
  setError,
  disputeTrade,
  setTradeStatus,
  TradeStatusEnum,
  AdvertisementSideEnum,
  setTradeInfo,
  setAdvertisementChat,
  getTradeTimerCancelDuration,
} from '../../store/otcSlice';
import {
  addFavoriteUser,
  getIsFavoriteUser,
  setUser,
} from '../../store/userSlice';
import { selectUser } from '../../store/userSlice';
import {
  addMessage,
  getChatMessages,
  selectMessages,
  setMessages,
} from '../../store/chatSlice';
import socketManager from '../../services/socketManager';
import Overlay from '../../components/Overlay';
import Popup from '../../components/Popup';
import {
  getExternalSources,
  selectExternalSources,
} from '../../store/sourceSlice';
import Toolbar from '../../components/Toolbar';
import usePopup from '../../hooks/usePopup';
import { uploadFileService } from '../../services/api/file';
import FormComplaint from '../complaint';
import {
  getSummary,
  getWallets,
  selectSummary,
  selectWallets,
} from '../../store/walletSlice';
import { useAuth } from '../../hooks/useAuth';
import { AppDispatch, RootState } from '../../store';
import createChat from '../../lib/createChat';
import {
  Box,
  styled,
  Typography,
  Button,
  Container,
  TextField,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  ButtonUnstyled,
} from '@mui/base';
import { Chat } from '../../components/Chat';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { OverlayPopup } from '../../components/OverlayPopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import { AlertPopup } from '../../components/AlertPopup';
import { SuccessPopup } from '../../components/SuccessPopup';
import {
  PaymentDetailsForm,
  PaymentDetailsFormFormValues,
} from './PaymentDetailsForm';
import MainSallerInfo from '../seller-profile/MainSallerInfo';
import AdvertisementInfo from './AdvertisementInfo';

const Advertisement = () => {
  const { authenticated, token } = useAuth();
  const dispatch: AppDispatch = useAppDispatch();
  const { id } = useParams<{
    id: string | undefined;
  }>();
  const history = useHistory();
  const wallets = useAppSelector(selectWallets);
  const advertisement = useAppSelector(selectAdvertisement);
  const markets = useAppSelector(selectMarkets);
  const [mainCurrencyId, setMainCurrencyId] = useState<string | undefined>();
  const [paidCurrencyId, setPaidCurrencyId] = useState<string | undefined>();
  const user = useAppSelector(selectUser);
  const [connected, setConnected] = useState<boolean>(false);
  const messages = useAppSelector(selectMessages);
  const chat = useAppSelector(selectAdvertisementChat);
  /** кол-во для покупки или продажи */
  const [volume, setVolume] = useState<number>(0);
  /** статус сделки */
  const tradeStatus = useAppSelector((state) => state.otc.tradeStatus);
  const tradeInfo = useAppSelector((state) => state.otc.tradeInfo);
  const error = useAppSelector((state) => state.otc.error);
  const { setPopup } = usePopup();
  const externalSources = useAppSelector(selectExternalSources);
  const [sumForPaid, setSumForPaid] = useState<number>(0);
  const [price, setPrice] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const timer = useAppSelector(
    (state: RootState) => state.otc.tradeTimerCancelDurationSeconds
  );

  const mainWallet = useMemo(() => {
    return advertisement && wallets && wallets.length
      ? wallets.find(
        (wallet) => wallet.currency_id === advertisement.market.mainCurrencyId
      )
      : undefined;
  }, [wallets, advertisement]);

  const paidWallet = useMemo(() => {
    return advertisement && wallets && wallets.length
      ? wallets.find(
        (wallet) => wallet.currency_id === advertisement.market.paidCurrencyId
      )
      : undefined;
  }, [wallets, advertisement]);

  const openComplaintForm = useCallback(() => {
    return setPopup(
      <Overlay onClick={() => setPopup(null)}>
        <Popup onClose={() => setPopup(null)}>
          <FormComplaint />
        </Popup>
      </Overlay>
    );
  }, []);

  useEffect(() => {
    // очищаем чат, чтобы не было мерцаний визуально
    dispatch(setMessages([]));
    // очищаем ошибки, чтобы мы случайно что-то не показали клиенту
    dispatch(setError(null));

    if (id) {
      dispatch(getAdvertisement(id));
      dispatch(getAdvertisementChat(id));
      dispatch(getExternalSources());
    } else {
      history.push('/otc');
    }
    return () => {
      dispatch(setTradeInfo(null));
      dispatch(setTradeInfo(null));
      dispatch(setAdvertisementChat(null));

      // удаляем текущий чат
      if (socketManager && socketManager.socket) {
        socketManager.socket = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chat && token && socketManager) {
      if (chat.tradeId) {
        console.log(`get trade status`);
        dispatch(getTradeStatus(chat.tradeId));
        console.log(`get trade info`);
        dispatch(getTradeInfo(chat.tradeId));
        if (socketManager && !socketManager.socket) {
          connect();
        }
      } else {
        dispatch(setTradeStatus(''));
      }

      dispatch(
        getChatMessages({
          id: chat.room.id,
          isReadAllMessages: false,
        })
      );
    }
  }, [chat]);

  useEffect(() => {
    if (advertisement) {
      if (
        advertisement.status === 'canceled' ||
        (user && user.id === advertisement.userId)
      ) {
        history.push('/otc');
      } else {
        dispatch(getMarketsOtc());
        dispatch(getWallets());
      }
    }
  }, [advertisement]);

  useEffect(() => {
    if (markets && advertisement) {
      const market = markets.find((item) => item.id === advertisement.marketId);

      if (market) {
        setMainCurrencyId(market.mainCurrencyId);
        setPaidCurrencyId(market.paidCurrencyId);
      }

      dispatch(
        getPaymentMethods({
          page: 1,
          take: 10,
        })
      );
    }
  }, [markets]);

  useEffect(() => {
    if (tradeInfo) {
      setVolume(tradeInfo.volume);
      setSumForPaid(tradeInfo.amount);
    }
  }, [tradeInfo]);

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
    const coefficient = (advertisement?.factor ?? 0) + 1;
    const calcSum = Number(volume) * Number(price) * coefficient;
    setSumForPaid(parseFloat(calcSum.toFixed(2)));
  }, [volume]);

  useEffect(() => {
    if (externalSources?.binance && advertisement?.marketId) {
      const currentPrice =
        externalSources?.binance?.find(
          (source) => source.marketId === advertisement?.marketId
        )?.price ?? '';
      setPrice(currentPrice);
    }
  }, [externalSources]);

  useEffect(() => {
    if (messages && messages.length && socketManager && !socketManager.socket) {
      connect();
    }
  }, [messages]);

  // useEffect(() => {
  //   if (tradeStatus && chat && chat.tradeId) {
  //     switch(tradeStatus) {
  //       case TradeStatusEnum.OPEN_WAIT_CONFIRM:
  //       case TradeStatusEnum.OPEN:
  //       case TradeStatusEnum.SEND_PAYMENT_DOCUMENT:
  //         dispatch(getTradeTimerCancelDuration({
  //           id: chat.tradeId
  //         }))
  //         break;
  //     }
  //   }
  // }, [tradeStatus])

  /**
   * file upload handler
   */
  const onFileUpload = useCallback(
    (
      files: {
        file: File;
        valid: boolean;
      }[]
    ) => {
      if (files.length && !loading) {
        setLoading(true);

        files
          .filter((file) => file.valid)
          .forEach(async (file) => {
            const data = new FormData();
            data.append('file', file.file);
            try {
              const response = await uploadFileService.uploadFile(data);

              console.log(response.data.id);

              setAttachments([response.data.id, ...attachments]);
            } catch (err) { }
          });

        setLoading(false);
      }
    },
    [loading]
  );

  /**
   * delete attachment handler
   */
  const onDeleteAttachment = useCallback(
    (id: string) => {
      setAttachments(attachments.filter((attachId) => attachId !== id));
    },
    [attachments]
  );

  const connect = useCallback(() => {
    if (chat && token) {
      // создаём новый чат
      socketManager.socket = createChat(chat.room.id, token);

      if (socketManager.socket) {
        // вешаем ивенты, чтобы получать сообщения с сервера
        socketManager.socket.on(`message-to-${chat.room.id}`, (message) => {
          dispatch(addMessage(message));

          if (chat.tradeId) {
            dispatch(getTradeStatus(chat.tradeId));
          }
        });
        socketManager.socket.on(`connected-to-${chat.room.id}`, (users) => {
          console.log(`connected!!!`);
          setConnected(true);
          console.log(`get chat messages`);
          dispatch(
            getChatMessages({
              id: chat.room.id,
              isReadAllMessages: false,
            })
          );
        });
      }
    }
  }, [chat, token]);

  /**
   * chat handler
   */
  const onSubmit = useCallback(
    async (message: string) => {
      console.log(advertisement);
      console.log(chat);
      console.log(tradeStatus);
      if (
        advertisement &&
        chat &&
        tradeStatus !== null &&
        //chat.tradeId && // проверяем, чтобы сделка была начата
        ![TradeStatusEnum.CANCEL.toString()].includes(tradeStatus) // проверяем, чтобы сделка не была отменена
      ) {
        if (!socketManager.socket) {
          console.log(`chat not created.`);
          connect();
        }

        if (socketManager.socket) {
          if (attachments.length) {
            // если у нас есть прикреплённые файлы, то отправляем их вместе с сообщением
            socketManager.socket?.emit('message-to-server', {
              message,
              roomId: chat.room.id,
              type: 'file',
              jwtToken: token,
              fileIds: attachments,
            });

            setAttachments([]);
          } else {
            // отправляем обычное сообщение
            socketManager.socket?.emit('message-to-server', {
              message,
              roomId: chat.room.id,
              type: 'text',
              jwtToken: token,
            });
          }
        }
      }
    },
    [tradeStatus, advertisement, chat, attachments]
  );

  /**
   * начать сделку
   */
  const openWaitConfirm = useCallback(async () => {
    if (
      advertisement &&
      mainWallet &&
      paidWallet &&
      volume &&
      chat &&
      volume > 0 &&
      // если это продажа крипты за крипту, то проверяем свой баланс для покупки
      ((advertisement.side === AdvertisementSideEnum.ASK &&
        (!paidWallet.isCoin || paidWallet.service_balance >= volume)) ||
        // если это покупка крипты за крипту, то проверяем свой баланс для продажи
        (advertisement.side === AdvertisementSideEnum.BID &&
          mainWallet.service_balance >= volume))
    ) {
      /**
       * обновляем статус сделки на open
       */
      await dispatch(
        openWaitConfirmTrade({
          advertisementId: advertisement.id,
          roomId: chat.room.id,
          volume,
        })
      );

      /**
       * обновляем сообщения в чате
       */
      await dispatch(getAdvertisementChat(advertisement.id));
    }
  }, [volume, mainWallet, paidWallet, advertisement, chat]);

  /**
   * отменяем сделку
   */
  const cancel = useCallback(() => {
    if (
      advertisement &&
      chat &&
      chat.tradeId &&
      tradeStatus &&
      // проверяем, чтобы статус сделки был в ожидании открытия или открыт!!!
      ([
        TradeStatusEnum.OPEN_WAIT_CONFIRM.toString(),
        TradeStatusEnum.OPEN.toString(),
      ].includes(tradeStatus) ||
        (advertisement.side === AdvertisementSideEnum.ASK &&
          tradeStatus === TradeStatusEnum.SEND_PAYMENT_DETAILS))
    ) {
      setPopup(
        <AlertPopup
          title="Подтверждение"
          closeable={true}
          onClose={() => setPopup(null)}
          positiveButton="Подтвердить"
          onPositiveButtonClick={async () => {
            const result = await dispatch(cancelTrade(chat.tradeId));
            if (result && result.payload) {
              setPopup(
                <SuccessPopup
                  onClose={() => {
                    setPopup(null);
                  }}
                  message="Сделка отменена!"
                />
              );
            }
          }}
        >
          Вы уверенны, что хотите отменить сделку?
        </AlertPopup>
      );
    }
  }, [advertisement, chat, tradeStatus]);

  /**
   * подтверждение оплаты
   */
  const confirmMoneyIsArrived = useCallback(async () => {
    if (advertisement && chat && chat.tradeId) {
      await dispatch(confirmTrade(chat.tradeId));
      await dispatch(getTradeStatus(chat?.tradeId));
    }
  }, [advertisement, chat]);

  /**
   * я оплатил
   */
  const iPaid = useCallback(() => {
    if (advertisement && chat && chat.tradeId && sumForPaid && paidWallet) {
      setPopup(
        <AlertPopup
          title="Подтверждение"
          closeable={true}
          onClose={() => setPopup(null)}
          positiveButton="Подтвердить"
          onPositiveButtonClick={async () => {
            await dispatch(sendPaymentDocumentTrade(chat.tradeId));
            await dispatch(getTradeStatus(chat?.tradeId));

            setPopup(null);
          }}
        >
          {`Вы уверены что оплатили ${sumForPaid} ${paidWallet.name} на счет ${advertisement.user.name}?`}
        </AlertPopup>
      );
    }
  }, [advertisement, chat, sumForPaid, paidWallet]);

  /**
   * Вычисляет комиссию сделки
   */
  const commission = useMemo(() => {
    return 0;
  }, []);

  /**
   * открываем спор
   */
  const onDispute = useCallback(async () => {
    if (chat && chat.tradeId) {
      setPopup(
        <AlertPopup
          title="Подтверждение"
          closeable={true}
          onClose={() => setPopup(null)}
          positiveButton="Подтвердить"
          onPositiveButtonClick={async () => {
            /**
             * Открываем спор
             */
            await dispatch(disputeTrade(chat.tradeId));

            /**
             * Обновляем статус сделки
             */
            await dispatch(getTradeStatus(chat.tradeId));

            setPopup(null);
          }}
        >
          Вы уверенны что хотите начать спор?
        </AlertPopup>
      );
    }
  }, [chat]);

  /**
   * действия для чата
   */
  const actions = useMemo(() => {
    if (chat && chat.tradeId && advertisement && tradeStatus) {
      // если объявление о покупке крипты
      if (advertisement.side === AdvertisementSideEnum.BID) {
        switch (tradeStatus) {
          case TradeStatusEnum.OPEN: // сделка начата
            return [
              {
                label: 'Ввести реквизиты',
              },
            ];
          case TradeStatusEnum.SEND_PAYMENT_DOCUMENT: // покупатель оплатил и ждёт подтверждения от нас (продавца)
            return [
              {
                label: 'Подтвердждаю оплату',
              },
            ];
        }
      } else if (advertisement.side === AdvertisementSideEnum.ASK) {
        // если сделка о продаже крипты
        switch (tradeStatus) {
          // продавец отправил реквизиты и мы (покупатель) должны подтвердить оплату фиата
          case TradeStatusEnum.SEND_PAYMENT_DETAILS:
            return [
              {
                label: 'Я оплатил',
              },
            ];
        }
      }
    }

    return [];
  }, [chat, tradeStatus, advertisement]);

  /**
   * обработчик действий для чата
   */
  const onActionClick = useCallback(
    (index: number) => {
      if (tradeStatus && advertisement && chat && chat.tradeId) {
        // если объявление о покупке крипты
        if (advertisement.side === AdvertisementSideEnum.BID) {
          switch (tradeStatus) {
            // сделка начата и мы (продавец) должны ввести реквизиты для перевода фиата
            case TradeStatusEnum.OPEN:
              setPopup(
                <PaymentDetailsForm
                  detailsPaymentMethods={advertisement.paymentMethods}
                  onSubmit={async ({
                    paymentDetails,
                    paymentMethod,
                  }: PaymentDetailsFormFormValues) => {
                    let message = paymentDetails.trim();
                    if (message.length) {
                      await dispatch(
                        sendPaymentDetailsTrade({
                          tradeId: chat.tradeId,
                          message,
                          paymentMethodId: paymentMethod,
                        })
                      );

                      setPopup(null);
                    }
                  }}
                  onClose={() => setPopup(null)}
                />
              );
              break;
            // покупатель оплатил и мы (продавец) должны подтвердить платёж
            case TradeStatusEnum.SEND_PAYMENT_DOCUMENT:
              confirmMoneyIsArrived();
              break;
          }
        } else if (advertisement.side === AdvertisementSideEnum.ASK) {
          // если сделка о продаже крипты
          switch (tradeStatus) {
            // продавец отослал свои реквизиты, на которые мы (покупатель) должны были перевести фиат
            case TradeStatusEnum.SEND_PAYMENT_DETAILS:
              iPaid();
              break;
          }
        }
      }
    },
    [tradeStatus, advertisement, paidWallet, sumForPaid, chat]
  );

  /**
   * Проверяет, авторизован ли пользователь
   */
  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          {advertisement &&
            advertisement.user &&
            chat &&
            user &&
            wallets &&
            wallets.length !== 0 &&
            mainWallet &&
            paidWallet &&
            tradeStatus !== null &&
            tradeStatus !== undefined ? (
            <Box display="flex" sx={{
              flexDirection: {
                sm: 'column',
              }
            }}>
              <MainSallerInfo userId={advertisement?.user.userId} />

              <Box display="flex" sx={{
                flexDirection: {
                  sm: 'column',
                  lg: 'row'
                }
              }}>
                <Box flex="1" p="24px">

                  <AdvertisementInfo advertisement={advertisement}
                    mainCurrencyId={mainCurrencyId || ''}
                    paidCurrencyId={paidCurrencyId || ''}
                  />

                  <Box mt="20px">
                    <Typography fontSize='16px' fontWeight='600'>
                      Сумма сделки
                    </Typography>
                    <Box display="flex" gap="20px" mt="10px" sx={{
                      flexDirection: {
                        sm: 'column',
                        md: 'row'
                      }
                    }}>
                      <NumberFormat
                        thousandsGroupStyle="thousand"
                        decimalSeparator="."
                        displayType="input"
                        customInput={TradeSumm}
                        thousandSeparator=" "
                        allowLeadingZeros={true}
                        disabled={
                          advertisement.userId === user.id ||
                          (chat.tradeId !== undefined && chat.tradeId !== null)
                        }
                        suffix={` ${mainCurrencyId}`}
                        value={volume === 0 ? '' : volume}
                        style={{
                          padding: '12px 0px',
                          width: '100%',
                          border: 0,
                          borderBottom:
                            '2px solid ' + theme.palette.primary.main,
                          boxSizing: 'border-box',
                        }}
                        placeholder="Количество"
                        onValueChange={(values: NumberFormatValues) => {
                          const { floatValue } = values;
                          const floatValueFix = floatValue ? floatValue : 0;

                          setVolume(floatValueFix);
                        }}
                        allowNegative={false}
                        isAllowed={(values: NumberFormatValues) => {
                          const { floatValue } = values;
                          const floatValueFix = floatValue ? floatValue : 0;

                          return (
                            floatValueFix <=
                            Math.max(
                              advertisement.volume,
                              advertisement.volumeMax
                            )
                          );
                        }}
                      />

                      <NumberFormat
                        thousandsGroupStyle="thousand"
                        decimalSeparator="."
                        displayType="input"
                        thousandSeparator=" "
                        allowLeadingZeros={true}
                        disabled={true}
                        suffix={` ${paidCurrencyId}`}
                        value={sumForPaid}
                        style={{
                          padding: '12px 0px',
                          width: '100%',
                          border: 0,
                          borderBottom:
                            '2px solid ' + theme.palette.primary.main,
                          boxSizing: 'border-box',
                        }}
                        placeholder="Сумма к оплате"
                      />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="20px"
                      mt="20px"
                      sx= {{
                        justifyContent: {
                          sm:'center',
                          md: 'flex-end'
                        },
                        flexDirection: {
                          sm:'column',
                          md: 'row'
                        }
                      }}
                    >
                      <Box display="flex" alignItems="center" gap="10px">
                        <Box>Комиссия:</Box>
                        <Box>
                          <b>
                            {commission} {mainCurrencyId}
                          </b>
                        </Box>
                        <Box>(0%)</Box>
                      </Box>


                      {chat.tradeId ? (
                        // сделка началась
                        // если наша сделка дошла до момента, когда реквизиты высланы, то
                        // показываем кнопку начать спор
                        [
                          TradeStatusEnum.SEND_PAYMENT_DOCUMENT.toString(),
                        ].includes(tradeStatus) ? (
                          <StyledButton onClick={() => onDispute()}>
                            Начать спор
                          </StyledButton>
                        ) : // если мы продаём крипту, мы начали сделку и ждём подтверждения начала сделки,
                          // то мы можем показать кнопку отменить сделку
                          [
                            TradeStatusEnum.OPEN_WAIT_CONFIRM.toString(),
                            TradeStatusEnum.OPEN.toString(),
                          ].includes(tradeStatus) ||
                            (advertisement.side === AdvertisementSideEnum.ASK &&
                              tradeStatus ===
                              TradeStatusEnum.SEND_PAYMENT_DETAILS) ? (
                            <StyledButton onClick={() => cancel()}>
                              Отменить сделку
                            </StyledButton>
                          ) : null
                      ) : (
                        // пока сделка не началась, показываем кнопку начать сделку если соблюдены все
                        // уловия для количества
                        <StyledButton
                          variant="outlined"
                          onClick={() => openWaitConfirm()}
                          disabled={
                            volume <= 0 ||
                            (advertisement.side === AdvertisementSideEnum.ASK &&
                              paidWallet.isCoin &&
                              paidWallet.service_balance < volume) ||
                            (advertisement.side === AdvertisementSideEnum.BID &&
                              mainWallet.service_balance < volume) ||
                            volume <
                            Math.min(
                              advertisement.volume,
                              advertisement.volumeMax
                            ) ||
                            volume >
                            Math.max(
                              advertisement.volume,
                              advertisement.volumeMax
                            )
                          }
                        >
                          Начать сделку
                        </StyledButton>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <ChatContainer>
                  <Chat
                    messages={messages}
                    userId={user.id!!}
                    onSubmit={onSubmit}
                    actions={actions}
                    onActionClick={onActionClick}
                    inputDisabled={[
                      //'',
                      TradeStatusEnum.CANCEL.toString(),
                    ].includes(tradeStatus)}
                    inputPlaceholder="Введите сообщение"
                    onFileUpload={onFileUpload}
                    onDeleteAttachment={onDeleteAttachment}
                    attachments={attachments}
                    timer={timer}
                  />
                </ChatContainer>
              </Box>
            </Box>
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
        </RoundedLayout>
      </Container >
    </View >
  );
};

const ChatContainer = styled(Box)`
  flex: 1;
  border-left: 1px solid #dce5e9;
`;

const Divider = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #D9D9D9',
  display: 'none',
  paddingBottom: '24px',
  [theme.breakpoints.down("lg")]: {
    display: 'block'
  }
}));

const StyledButton = styled(ButtonUnstyled)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  border-radius: 36px;
  border: 0;
  padding: 12px 20px;
  &:disabled {
    background-color:  ${(props) => props.theme.palette.secondary.dark};
  }
`;

const TradeSumm = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    padding: '4px 0 5px',
  },
  '& fieldset.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export default Advertisement;
