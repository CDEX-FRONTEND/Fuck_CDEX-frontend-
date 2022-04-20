import { AxiosResponse } from 'axios';
import {
  AdvertisementChatType,
  AdvertisementPropsType,
  AdvertisementSellerInfoType,
  AdvertisementType,
  GetAdvertisementChatListParamsType,
  IGetAdvertisementListRequestValues,
  GetMyTradeListParamsType,
  GetPaymentMethodListParamsType,
  OpenConfirmTradeType,
  OpenWaitConfirmTradeType,
  PaymentMethodType,
  SendPaymentDetailsTradeType,
  TradeType,
  FavoriteListParamsType,
  FavoriteListType,
  TradeStatusEnum,
} from '../../store/otcSlice';
import { httpClient } from '../httpClient';

export interface GetPaymentMethodResponseValue {
  method: PaymentMethodType;
}

export interface GetAdvertisementResponseValue {
  advertisement: AdvertisementType;
}

export interface GetMyTradeListResponseValue {
  trades: TradeType[];
}

export interface GetTradeStatusResponseValue {
  status: string;
}

export interface GetUserInfoResponseValue {
  user: AdvertisementSellerInfoType;
}

export interface GetTradesRequestValues {
  take: number;
  page: number;
  status?: string[];
  statusHistory?: string[];
  orders?: {
    field: string;
    direction: string;
  }[];
  filters?: {
    field: string;
    operator: string;
    value: string;
  }[];
}

export interface GetTradesResponseValue {
  page: number;
  take: number;
  total: number;
  trades: TradeType[];
}

export interface CancelDisputeRequestValues {
  tradeId: string;
}

export interface CompleteDisputeRequestValues {
  tradeId: string;
}

export interface GetTradeTimerCancelDurationRequestValues {
  id: string
}

export interface GetTradeTimerCancelDurationResponseValue {
  tradeId: string;
  type: string;
  durationSeconds: number;
}

export const otcService = {
  getPaymentMethods({ page, take }: GetPaymentMethodListParamsType) {
    return httpClient.get(
      `/api/v1/otc/payment-method/list?page=${page}&take=${take}`
    );
  },

  getPaymentMethod(
    id: string
  ): Promise<AxiosResponse<GetPaymentMethodResponseValue>> {
    return httpClient.get(`/api/v1/otc/payment-method/${id}`);
  },

  updatePaymentMethod(
    requestValues: PaymentMethodType
  ): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/payment-method/', requestValues);
  },

  getAdvertisementList(
    requestValues: IGetAdvertisementListRequestValues
  ) {
    return httpClient.post('/api/v1/otc/advertisement/list', {
      ...requestValues,
    });
  },

  getMyAdvertisementList(
    requestValues: IGetAdvertisementListRequestValues
  ) {
    return httpClient.post('/api/v1/otc/advertisement/list/my', {
      ...requestValues,
    });
  },

  getAdvertisement(
    id: string
  ): Promise<AxiosResponse<GetAdvertisementResponseValue>> {
    return httpClient.get(`/api/v1/otc/advertisement/${id}`);
  },

  createAdvertisement(
    requestValues: AdvertisementPropsType
  ): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/advertisement', requestValues);
  },

  changeAdvertisementStatus(_: any): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/advertisement/status/change', _);
  },

  cancelAdvertisement(id: string): Promise<AxiosResponse> {
    return httpClient.get(`/api/v1/otc/advertisement/${id}/cancel`);
  },

  getAdvertisementChat(
    advertisementId: string
  ): Promise<AxiosResponse<AdvertisementChatType>> {
    return httpClient.post('/api/v1/otc/advertisement/chat', {
      advertisementId,
    });
  },

  getTradeChat(tradeId: string): Promise<AxiosResponse<AdvertisementChatType>> {
    return httpClient.post('/api/v1/otc/trade/chat', {
      tradeId,
    });
  },

  getAdvertisementChatList(
    params: GetAdvertisementChatListParamsType
  ): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/otc/advertisement/chat/list', { params });
  },

  openWaitConfirmTrade(
    trade: OpenWaitConfirmTradeType
  ): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/open-wait-confirm', trade);
  },

  openConfirmTrade(trade: OpenConfirmTradeType): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/open-confirm', trade);
  },

  sendPaymentDetailsTrade(
    trade: SendPaymentDetailsTradeType
  ): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/send-payment-details', trade);
  },

  sendPaymentDocumentTrade(tradeId: string): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/send-payment-document', {
      tradeId,
    });
  },

  confirmTrade(tradeId: string): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/confirm', { tradeId });
  },

  disputeTrade(tradeId: string): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/dispute', { tradeId });
  },

  cancelTrade(tradeId: string): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/otc/trade/cancel', { tradeId });
  },

  getTrades(
    requestValues: GetTradesRequestValues
  ): Promise<AxiosResponse<GetTradesResponseValue>> {
    return httpClient.post('/api/v1/otc/trade/list', requestValues);
  },

  cancelDispute(requestValues: CancelDisputeRequestValues) {
    return httpClient.post('/api/v1/otc/trade/dispute/cancel', requestValues);
  },

  completeDispute(requestValues: CompleteDisputeRequestValues) {
    return httpClient.post('/api/v1/otc/trade/dispute/complete', requestValues);
  },

  getMyTrades(
    params: GetMyTradeListParamsType
  ): Promise<AxiosResponse<GetMyTradeListResponseValue>> {
    const isOpenStatus = params.status === TradeStatusEnum.OPEN;
    const requestValues = {
      ...params,
      ...(params.status ? {
        filters: [{
        field: 'status',
        operator: isOpenStatus ? 'not in' : 'in',
        value: isOpenStatus ? [TradeStatusEnum.ERROR, TradeStatusEnum.COMPLETE, TradeStatusEnum.CANCEL] : params.status,
      }],
      } : {}),
    };

    return httpClient.post('/api/v1/otc/trade/list/my', requestValues);
  },

  getTradeStatus(
    id: string
  ): Promise<AxiosResponse<GetTradeStatusResponseValue>> {
    return httpClient.get(`/api/v1/otc/trade/${id}/status`);
  },

  getTradeInfo(
    id: string
  ): Promise<AxiosResponse<GetTradeStatusResponseValue>> {
    return httpClient.get(`/api/v1/otc/trade/${id}`);
  },

  getAdvertisementSellerInfo(
    id: string
  ): Promise<AxiosResponse<GetUserInfoResponseValue>> {
    return httpClient.get(`/api/v1/otc/user/${id}`);
  },

  getMyFavoriteList(
    params: FavoriteListParamsType
  ): Promise<AxiosResponse<FavoriteListType>> {
    return httpClient.get('/api/v1/otc/user/favorite/list', { params });
  },

  getTradeTimerCancelDuration(requestValues: GetTradeTimerCancelDurationRequestValues): Promise<AxiosResponse<GetTradeTimerCancelDurationResponseValue>> {
    return httpClient.get('/api/v1/otc/trade/' + requestValues.id + '/timer-to-cancel');
  },
};
