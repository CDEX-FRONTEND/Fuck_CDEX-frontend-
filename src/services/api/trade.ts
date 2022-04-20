import { AxiosResponse } from 'axios';
import { ParamsType } from '../../store/tradeSlice';
import { TradeType } from '../../store/tradeSlice';
import { httpClient } from '../httpClient';

export interface GetTradeResponseValue {
  trades: TradeType[];
}

export interface GetAdvertisementFee {
  advertisementId: string,
  side: string,
  volume: number
}

export const tradeService = {
  getMy(params: ParamsType): Promise<AxiosResponse<GetTradeResponseValue>> {
    return httpClient.get('/api/v1/trades/my', { params });
  },

  getLast(): Promise<AxiosResponse<GetTradeResponseValue>> {
    return httpClient.get('/api/v1/trades/last');
  },

  getAdvertisementFee(requestValues: GetAdvertisementFee): Promise<AxiosResponse> {
    return httpClient.post(`/api/v1/otc/fee`, requestValues);
  },

};
