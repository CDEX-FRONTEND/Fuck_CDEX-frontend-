import {
  Box,
  CircularProgress,
  Container,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import {
  ButtonUnstyled
} from '@mui/base';

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
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getMarkets, selectMarkets } from '../../store/marketSlice';
import {
  cancelTrade,
  confirmTrade,
  getPaymentMethods,
  getTradeInfo,
  getTradeStatus,
  openConfirmTrade,
  resetChat,
  resetTradeInfo,
  sendPaymentDetailsTrade,
  sendPaymentDocumentTrade,
  setError,
  getTradeChat,
  selectTradeChat,
  getAdvertisement,
  selectAdvertisement,
  disputeTrade,
  TradeStatusEnum,
  AdvertisementSideEnum,
} from '../../store/otcSlice';
import { selectUser } from '../../store/userSlice';
import {
  addMessage,
  getChatMessages,
  selectMessages,
  setMessages,
} from '../../store/chatSlice';
import socketManager from '../../services/socketManager';
import { ErrorPopup } from '../../components/ErrorPopup';
import {
  getExternalSources,
  selectExternalSources,
} from '../../store/sourceSlice';
import Toolbar from '../../components/Toolbar';
import usePopup from '../../hooks/usePopup';
import { uploadFileService } from '../../services/api/file';
import { getWallets, selectWallets } from '../../store/walletSlice';
import { useAuth } from '../../hooks/useAuth';
import createChat from '../../lib/createChat';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { Chat } from '../../components/Chat';
import { AlertPopup } from '../../components/AlertPopup';
import {
  getAdvertisementFee,
  selectMyTradeFee,
  setTradeFee,
} from '../../store/tradeSlice';
import {
  PaymentDetailsForm,
  PaymentDetailsFormFormValues,
} from '../advertisement/PaymentDetailsForm';
import MainSallerInfo from '../seller-profile/MainSallerInfo';
import AdvertisementInfo from '../advertisement/AdvertisementInfo';

const Trade = () => {
  const { authenticated, token } = useAuth();
  const { setPopup } = usePopup();
  const { id } = useParams<{
    id: string | undefined;
  }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const markets = useAppSelector(selectMarkets);
  const myTradeFee = useAppSelector(selectMyTradeFee);
  const [mainCurrencyId, setMainCurrencyId] = useState<string | undefined>();
  const [paidCurrencyId, setPaidCurrencyId] = useState<string | undefined>();
  const chatContainerRef = createRef<HTMLDivElement>();
  const user = useAppSelector(selectUser);
  const [connected, setConnected] = useState<boolean>(false);
  const messages = useAppSelector(selectMessages);
  const [volume, setVolume] = useState<number>(0);
  /** статус сделки */
  const tradeStatus = useAppSelector((state) => state.otc.tradeStatus);
  const tradeInfo = useAppSelector((state) => state.otc.tradeInfo);
  const advertisement = useAppSelector(selectAdvertisement);
  const error = useAppSelector((state) => state.otc.error);
  const chat = useAppSelector(selectTradeChat);
  const [showEnterRequisites, setShowEnterRequisites] = useState(false);
  const externalSources = useAppSelector(selectExternalSources);
  const [sumForPaid, setSumForPaid] = useState<number | string>('');
  const [price, setPrice] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const wallets = useAppSelector(selectWallets);
  const theme = useTheme();
  const mainWallet = useMemo(() => {
    return (
      wallets &&
      advertisement &&
      wallets.find(
        (wallet) => wallet.name === advertisement.market.mainCurrencyId
      )
    );
  }, [wallets, advertisement]);

  const paidWallet = useMemo(() => {
    return (
      wallets &&
      advertisement &&
      wallets.find(
        (wallet) => wallet.name === advertisement.market.paidCurrencyId
      )
    );
  }, [wallets, advertisement]);

  useEffect(() => {
    // очищаем список сообщений в чате, чтобы не было мерцаний
    dispatch(setMessages([]));
    // очищаем ошибки, чтобы случайно что-то не отобразить
    dispatch(setError(null));

    if (id) {
      dispatch(getTradeInfo(id));
      dispatch(getExternalSources());
      dispatch(getWallets());
    } else {
      history.push('/otc');
    }

    return () => {
      dispatch(resetTradeInfo());
      dispatch(resetChat());
      dispatch(setTradeFee(null));
    };
  }, []);

  useEffect(() => {
    if (tradeInfo) {
      if (tradeInfo.id) {
        dispatch(getAdvertisement(tradeInfo.advertisementId));
        dispatch(getTradeStatus(tradeInfo.id));
        dispatch(getTradeChat(tradeInfo.id));
        dispatch(
          getAdvertisementFee({
            advertisementId: tradeInfo.advertisementId,
            side: tradeInfo.advertisement.side,
            volume: tradeInfo.volume,
          })
        );
      }

      socketManager.socket?.close();
      socketManager.socket = null;
      if (token) {
        socketManager.socket = createChat(tradeInfo.roomId, token);
        socketManager.socket.on(`message-to-${tradeInfo.roomId}`, (message) => {
          dispatch(addMessage(message));

          if (tradeInfo.id) {
            dispatch(getTradeStatus(tradeInfo.id));
          }
        });
        socketManager.socket.on(`connected-to-${tradeInfo.roomId}`, (users) => {
          setConnected(true);
          dispatch(
            getChatMessages({
              id: tradeInfo.roomId,
              isReadAllMessages: false,
            })
          );
        });
      } else {
        setConnected(false);
      }
    }
  }, [tradeInfo]);

  useEffect(() => {
    if (advertisement && advertisement.status !== 'canceled') {
      dispatch(getMarkets());
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
    if (messages && messages.length && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
          onClose={() => setPopup(null)}
          errorMessage={error.message}
        />
      );
    }
  }, []);

  useEffect(() => {
    const coefficient = (advertisement?.factor ?? 0) + 1;
    const calcSum = Number(volume) * Number(price) * coefficient;
    setSumForPaid(calcSum.toFixed(2));
  }, [volume, price]);

  useEffect(() => {
    if (externalSources?.binance && advertisement?.marketId) {
      const currentPrice =
        externalSources?.binance?.find(
          (source) => source.marketId === advertisement?.marketId
        )?.price ?? '';

      setPrice(currentPrice);
    }
  }, [externalSources, advertisement]);

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
            } catch (err) {}
          });

        setLoading(false);
      }
    },
    [loading]
  );

  const onDeleteAttachment = useCallback(
    (id: string) => {
      setAttachments(attachments.filter((attachId) => attachId !== id));
    },
    [attachments]
  );

  /**
   * chat handler
   */
  const onSubmit = useCallback(
    async (message: string) => {
      if (
        connected &&
        advertisement &&
        chat &&
        chat.tradeId &&
        tradeStatus &&
        user &&
        ![TradeStatusEnum.CANCEL.toString()].includes(tradeStatus)
      ) {
        // if (
        //   // ввод реквизитов
        //   // если сделка на продажу крипты и я ее автор
        //   ((advertisement.side === AdvertisementSideEnum.ASK &&
        //     advertisement.userId === user.id) ||
        //     // если сделка на покупку и я не ее автор
        //     (advertisement.side === AdvertisementSideEnum.BID &&
        //       advertisement.userId !== user.id)) &&
        //   // сделка должна быть начата
        //   tradeStatus === TradeStatusEnum.OPEN.toString()
        // ) {
        //   await dispatch(
        //     sendPaymentDetailsTrade({
        //       tradeId: chat.tradeId,
        //       message,
        //     })
        //   );
        //   // скрываем ввод реквизитов в чате
        //   setShowEnterRequisites(false);
        // } else
        if (attachments.length) {
          // если есть прикрепленные файлы
          socketManager.socket?.emit('message-to-server', {
            message,
            roomId: chat.room.id,
            type: 'file',
            jwtToken: token,
            fileIds: attachments,
          });
          setAttachments([]);
        } else {
          // обычная отправка сообщения в чат
          socketManager.socket?.emit('message-to-server', {
            message,
            roomId: chat.room.id,
            type: 'text',
            jwtToken: token,
          });
        }
      }
    },
    [user, tradeStatus, advertisement, chat, connected, attachments]
  );

  /**
   * отмена сделки
   */
  const cancel = useCallback(() => {
    if (
      advertisement &&
      user &&
      chat &&
      chat.tradeId &&
      tradeStatus &&
      ([
        TradeStatusEnum.OPEN_WAIT_CONFIRM.toString(),
        TradeStatusEnum.OPEN.toString(),
      ].includes(tradeStatus) ||
        // если сделка на покупку крипты, то мы может отменить сделку и после того, когда нам скинули реквизиты
        (advertisement.side === AdvertisementSideEnum.BID &&
          tradeStatus === TradeStatusEnum.SEND_PAYMENT_DETAILS) ||
        // если мы являемся автором сделки
        (advertisement.userId === user.id &&
          tradeStatus === TradeStatusEnum.OPEN_WAIT_CONFIRM))
    ) {
      dispatch(cancelTrade(chat.tradeId));
    }
  }, [advertisement, user, chat, tradeStatus]);

  /**
   * подтверждаем открытие сделки
   */
  const openConfirm = useCallback(async () => {
    if (advertisement && chat && chat.tradeId) {
      await dispatch(
        openConfirmTrade({
          advertisementId: advertisement.id,
          tradeId: chat.tradeId,
        })
      );
      // обновляем статус сделки
      await dispatch(getTradeStatus(chat?.tradeId));
    }
  }, [chat, advertisement]);

  /**
   * подтверждение оплаты
   */
  const confirmMoneyIsArrived = useCallback(async () => {
    if (
      advertisement &&
      chat &&
      chat.tradeId &&
      tradeInfo &&
      mainWallet &&
      sumForPaid &&
      paidWallet
    ) {
      setPopup(
        <AlertPopup
          title="Подтверждение сделки"
          closeable={true}
          onClose={() => setPopup(null)}
          positiveButton="Подтвердить"
          onPositiveButtonClick={async () => {
            await dispatch(confirmTrade(chat.tradeId));
            await dispatch(getTradeStatus(chat.tradeId));

            setPopup(null);
          }}
        >
          <Box>
            {`Вы уверены в том, что получили ${sumForPaid} ${
              paidWallet.name
            } от ${
              advertisement.side === 'ask'
                ? tradeInfo.bidUser.name
                : tradeInfo.askUser.name
            }?`}
            <br />
            {`Вернуть ${tradeInfo.volume} ${mainWallet.name} после завершения сделки невозможно.`}
            <br />
            Обязательно дождитесь и проверьте фактически получение средств на
            счет!
            <br />
            <br />
            Любой агент поддержки требующий отправить монеты является
            самозванцем!
            <br />
            Единственная служба поддержки доступна по ссылке выше.
          </Box>
        </AlertPopup>
      );
    }
  }, [advertisement, chat, sumForPaid, mainWallet, paidWallet, tradeInfo]);

  /**
   * я оплатил
   */
  const iPaid = useCallback(async () => {
    if (
      advertisement &&
      chat &&
      chat.tradeId &&
      paidWallet &&
      sumForPaid &&
      tradeInfo &&
      user
    ) {
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
          <Box>
              Вы уверенны что оплатили{' '}
              <b>
                {sumForPaid} {paidWallet.currency_id}
              </b>
              {' '}на счет{' '}
              <b>
                {advertisement.userId === user.id && tradeInfo.side === AdvertisementSideEnum.BID
                    ? tradeInfo.bidUser.name
                    : tradeInfo.askUser.name}
              </b>
              ?
            </Box>
        </AlertPopup>
      );
    }
  }, [advertisement, chat, paidWallet, tradeInfo, sumForPaid, user]);

  /**
   * добавить в избранное
   */

  const commission = useMemo(() => {
    let commission = (volume / 100) * 0.15;
    let commissionAsString = commission.toString();
    if (commissionAsString.includes('.')) {
      const sumbolsAfterComm = commissionAsString.split('.')[1];
      if (sumbolsAfterComm.length > 5) {
        return commission > 0.00009
          ? commission.toFixed(5).toString().replace(/0*$/, '')
          : 0.00001;
      } else {
        return commission.toFixed(commissionAsString.split('.')[1].length);
      }
    }
    return commission;
  }, [volume]);

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
            await dispatch(getTradeStatus(chat?.tradeId));

            setPopup(null);
          }}
        >
          Вы уверенны что хотите начать спор?
        </AlertPopup>
      );
    }
  }, [chat]);

  const actions = useMemo(() => {
    if (chat && chat.tradeId && advertisement && tradeStatus && user) {
      // проверяем, чтобы пользователь был продавцом
      if (
        // если сделка на продажу крипты и я ее автор
        (advertisement.side === AdvertisementSideEnum.ASK &&
          advertisement.userId === user.id) ||
        // если сделка на покупку и я продавец
        (advertisement.side === AdvertisementSideEnum.BID &&
          advertisement.userId !== user.id)
      ) {
        switch (tradeStatus) {
          case TradeStatusEnum.OPEN:
            return [
              {
                label: 'Ввести реквизиты',
              },
            ];
          case TradeStatusEnum.SEND_PAYMENT_DOCUMENT:
            return [
              {
                label: 'Подтвердждаю оплату',
              },
            ];
        }
      } else {
        switch (tradeStatus) {
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
  }, [chat, tradeStatus, advertisement, user]);

  const onActionClick = useCallback(
    (index: number) => {
      if (advertisement && user && tradeStatus && chat && chat.tradeId) {
        if (
          // если сделка на продажу крипты и я автор
          (advertisement.side === AdvertisementSideEnum.ASK &&
            advertisement.userId === user.id) ||
          // если сделка на покупку крипты и я продавец
          (advertisement.side === AdvertisementSideEnum.BID &&
            advertisement.userId !== user.id)
        ) {
          switch (tradeStatus) {
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
            case TradeStatusEnum.SEND_PAYMENT_DOCUMENT:
              confirmMoneyIsArrived();
              break;
          }
        } else {
          switch (tradeStatus) {
            case TradeStatusEnum.SEND_PAYMENT_DETAILS:
              iPaid();
              break;
          }
        }
      }
    },
    [tradeStatus, advertisement, user, chat]
  );

  const fixTradeFee = (volume: any) => {
    console.log('volume', volume);
    if (volume) {
      if (Math.abs(volume) < 1.0) {
        let e = parseInt(volume.toString().split('e-')[1]);
        if (e) {
          volume *= Math.pow(10, e - 1);
          volume =
            '0.' + new Array(e).join('0') + volume.toString().substring(2);
        }
      } else {
        let e = parseInt(volume.toString().split('+')[1]);
        if (e > 20) {
          e -= 20;
          volume /= Math.pow(10, e);
          volume += new Array(e + 1).join('0');
        }
      }

      const sumbolsAfterComm = volume.toString().split('.')[1];
      if (sumbolsAfterComm?.length > 8) {
        return '0.00000001';
      }
      return volume;
    }
    return 0;
  };

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
          user &&
          chat &&
          tradeStatus !== undefined &&
          tradeStatus !== null &&
          wallets &&
          mainWallet &&
          paidWallet ? (
            <Box>
              <MainSallerInfo
                userId={advertisement.userId}
              />

              <Box display="flex" sx= {{
                flexDirection: {
                  sm: 'column',
                  lg:'row'
                }
              }}>
                <div
                  style={{
                    flex: 1,
                    padding: '24px',
                  }}
                >
                  <AdvertisementInfo
                    advertisement={advertisement}
                    mainCurrencyId={mainCurrencyId || ''}
                    paidCurrencyId={paidCurrencyId || ''}
                  />

                  <Divider />
                  <Box mt="20px">
                    <Typography fontSize="16px" fontWeight="600">
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
                          return floatValueFix <= advertisement.volumeMax;
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
                  </Box>
                  <Box
                    display="flex"
                    gap="20px"
                    mt="20px"
                    alignItems="center"
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
                    {volume && Number(volume) > 0 ? (
                      <Box display="flex" gap="10px" alignItems="center">
                        <Box>Комиссия:</Box>
                        <Box fontWeight="bold">
                          {fixTradeFee(myTradeFee?.feeSum)}{' '}
                          {myTradeFee?.feeCurrencyId}
                        </Box>
                        <Box>({(myTradeFee?.percent || 0) * 100}%)</Box>
                      </Box>
                    ) : null}

                    {
                      // если сделка началась и требует подтверждения
                      tradeStatus === TradeStatusEnum.OPEN_WAIT_CONFIRM &&
                      advertisement.userId === user.id ? (
                        <Box
                          display="flex"
                          alignItems="center"
                          gap="10px"
                          flexDirection="column"
                        >
                          <StyledButton
                            onClick={() => openConfirm()}
                            style={{
                              width: '100%',
                            }}
                          >
                            Подтвердить сделку
                          </StyledButton>
                          <StyledButton
                            onClick={() => cancel()}
                            style={{
                              width: '100%',
                            }}
                          >
                            Отменить сделку
                          </StyledButton>
                        </Box>
                      ) : // если сделка находится в статусе "я оплатил"
                      [
                          TradeStatusEnum.SEND_PAYMENT_DOCUMENT.toString(),
                        ].includes(tradeStatus) ? (
                        <StyledButton onClick={() => onDispute()}>
                          Начать спор
                        </StyledButton>
                      ) : // если мы продаём крипту и сделка открыта или мы отправили реквизиты или
                      // мы покупаем крипту, то показываем кнопку отмены
                      [
                          TradeStatusEnum.OPEN_WAIT_CONFIRM.toString(),
                          TradeStatusEnum.OPEN.toString(),
                        ].includes(tradeStatus) ||
                        (advertisement.side === AdvertisementSideEnum.BID &&
                          tradeStatus ===
                            TradeStatusEnum.SEND_PAYMENT_DETAILS) ? (
                        <StyledButton onClick={() => cancel()}>
                          Отменить сделку
                        </StyledButton>
                      ) : null
                    }
                  </Box>
                </div>

                <Divider />

                <ChatContainer>
                  <Chat
                    messages={messages}
                    userId={user.id!!}
                    onSubmit={onSubmit}
                    actions={actions}
                    onActionClick={onActionClick}
                    inputDisabled={[
                      '',
                      TradeStatusEnum.CANCEL.toString(),
                    ].includes(tradeStatus)}
                    inputPlaceholder={
                      // если мы продаём крипту за фиат и сделка началась, нам нужно ввести реквизиты
                      advertisement.side === AdvertisementSideEnum.ASK &&
                      advertisement.userId === user.id &&
                      tradeStatus === TradeStatusEnum.OPEN &&
                      showEnterRequisites
                        ? 'Введите реквизиты'
                        : 'Введите сообщение'
                    }
                    onFileUpload={onFileUpload}
                    onDeleteAttachment={onDeleteAttachment}
                    attachments={attachments}
                  />
                </ChatContainer>
              </Box>
            </Box>
          ) : (
            <Box
              p="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress />
            </Box>
          )}
        </RoundedLayout>
      </Container>
    </View>
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

const TradeSumm = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    padding: '4px 0 5px',
  },
  '& fieldset.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
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
`;

export default Trade;
