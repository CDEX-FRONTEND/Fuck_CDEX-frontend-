import { Box, styled, Typography, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import { Chat } from '../../../components/Chat';
import { AlertPopup } from '../../../components/AlertPopup';
import View from '../../../components/View';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { useAuth } from '../../../hooks/useAuth';
import usePopup from '../../../hooks/usePopup';
import createChat from '../../../lib/createChat';
import socketManager from '../../../services/socketManager';
import { AppDispatch, RootState } from '../../../store';
import {
  addMessage,
  getChatMessages,
  selectMessages,
} from '../../../store/chatSlice';
import { getMarkets, selectMarkets } from '../../../store/marketSlice';
import {
  cancelDispute,
  completeDispute,
  getAdvertisement,
  getTradeChat,
  getTradeInfo,
  getTradeStatus,
  selectAdvertisement,
  selectTradeChat,
  TradeStatusEnum,
} from '../../../store/otcSlice';

const Trade = () => {
  const {
    id,
  }: {
    id: string | undefined;
  } = useParams();
  const { token } = useAuth();
  const dispatch: AppDispatch = useAppDispatch();
  const tradeInfo = useAppSelector((state: RootState) => state.otc.tradeInfo);
  const [connected, setConnected] = useState<boolean>(false);
  const messages = useAppSelector(selectMessages);
  const history = useHistory();
  const [mainCurrencyId, setMainCurrencyId] = useState<string | undefined>();
  const [paidCurrencyId, setPaidCurrencyId] = useState<string | undefined>();
  const advertisement = useAppSelector(selectAdvertisement);
  const markets = useAppSelector(selectMarkets);
  const { setPopup } = usePopup();
  const tradeStatus = useAppSelector(
    (state: RootState) => state.otc.tradeStatus
  );
  useEffect(() => {
    if (id) {
      dispatch(getTradeInfo(id));
      dispatch(getTradeChat(id));
      dispatch(getTradeStatus(id));
    }
  }, []);

  useEffect(() => {
    if (tradeInfo) {
      dispatch(getAdvertisement(tradeInfo.advertisementId));

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
    if (advertisement) {
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
    }
  }, [markets]);

  const onSubmit = useCallback(
    (message: string) => {
      if (tradeInfo && connected) {
        // if (attachments.length) {
        //   socketManager.socket?.emit('message-to-server', {
        //     message,
        //     roomId: tradeInfo?.roomId,
        //     type: 'file',
        //     jwtToken: token,
        //     fileIds: attachments,
        //   });
        //   setAttachments([]);
        // } else {
        socketManager.socket?.emit('message-to-server', {
          message,
          roomId: tradeInfo.roomId,
          type: 'text',
          jwtToken: token,
        });
        // }
      }
    },
    [tradeInfo, connected]
  );

  const actions = useMemo(() => {
    if (tradeStatus && tradeStatus === TradeStatusEnum.DISPUTE_OPEN) {
      return [
        {
          label: 'Отменить сделку',
        },
        {
          label: 'Завершить сделку',
        },
      ];
    }

    return [];
  }, [tradeStatus]);

  const onActionClick = useCallback(
    (index: number) => {
      if (
        tradeInfo &&
        tradeStatus &&
        tradeStatus === TradeStatusEnum.DISPUTE_OPEN
      ) {
        switch (index) {
          case 0:
            setPopup(
              <AlertPopup
                title="Подтверждение"
                closeable
                onClose={() => setPopup(null)}
                positiveButton="Подтверждаю"
                onPositiveButtonClick={async () => {
                  setPopup(null);
                  await dispatch(
                    cancelDispute({
                      tradeId: tradeInfo.id,
                    })
                  );
                  await dispatch(getTradeStatus(tradeInfo.id));
                }}
              >
                Вы уверенны что хотите отменить сделку?
              </AlertPopup>
            );
            break;
          case 1:
            setPopup(
              <AlertPopup
                title="Подтверждение"
                closeable
                onClose={() => setPopup(null)}
                positiveButton="Подтверждаю"
                onPositiveButtonClick={async () => {
                  setPopup(null);
                  await dispatch(
                    completeDispute({
                      tradeId: tradeInfo.id,
                    })
                  );
                  await dispatch(getTradeStatus(tradeInfo.id));
                }}
              >
                Вы уверенны что хотите завершить сделку?
              </AlertPopup>
            );
            break;
        }
      }
    },
    [tradeInfo, tradeStatus]
  );

  return (
    <View>
      {tradeInfo && advertisement && tradeStatus ? (
        <Box height="100%">
          <Box display="flex" height="100%">
            <Box flex="1">
              <Box m="30px">
                <BackButton onClick={() => history.push('/admin/disputes')} />

                <Box mt="20px">
                  <Typography variant="h6" component="h6">
                    {`${tradeInfo.advertisement.side === 'ask'
                      ? 'Продать'
                      : 'Купить'
                      } ${mainCurrencyId} за ${paidCurrencyId}`}
                  </Typography>

                  <Box mb="20px" mt="20px">
                    <Box color="#696969">Ставка</Box>
                    <Box mt="10px">
                      {tradeInfo.advertisement.factor * 100}% (вы оплачиваете)
                    </Box>
                  </Box>

                  <Box mb="20px">
                    <Box color="#696969">Метод оплаты</Box>
                    <Box mt="10px">
                      {advertisement.paymentMethods.length > 0 ? advertisement.paymentMethods
                        .map((paymentMethod) => paymentMethod.name)
                        .join(', ') : 'Любой'}
                    </Box>
                  </Box>

                  <Box mb="20px">
                    <Box color="#696969">Количество</Box>
                    <Box mt="10px">
                      {advertisement.volume} - {advertisement.volumeMax}
                    </Box>
                  </Box>

                  <Box mb="20px">
                    <Box color="#696969">Условия сделки</Box>
                    <Box mt="10px">
                      {advertisement.conditionsTrade || 'Не указаны'}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <ChatContainer>
              <Chat
                messages={messages}
                userId=""
                onSubmit={onSubmit}
                inputDisabled={tradeStatus !== TradeStatusEnum.DISPUTE_OPEN}
                inputPlaceholder="Введите сообщение"
                // onFileUpload={onFileUpload}
                // onDeleteAttachment={onDeleteAttachment}
                // attachments={attachments}
                actions={actions}
                onActionClick={onActionClick}
                fullHeight
              />
            </ChatContainer>
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" p="60px">
          <CircularProgress />
        </Box>
      )}
    </View>
  );
};

const ChatContainer = styled(Box)`
  flex: 1;
  border-left: 1px solid #dce5e9;
  height: 100%;
`;

export { Trade };
