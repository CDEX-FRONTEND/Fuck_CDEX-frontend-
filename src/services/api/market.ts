import { AxiosResponse } from 'axios';
import { MarketType, PriceType } from '../../store/marketSlice';
import { httpClient } from '../httpClient';

export interface GetMarketsResponseValue {
  markets: MarketType[];
}

export interface GetPriceResponseValue {
  price: PriceType[];
}

export const marketService = {
  getMarkets(): Promise<AxiosResponse<GetMarketsResponseValue>> {
    return httpClient.get('/api/v1/markets');
  },

  getMarketsOtc(): Promise<AxiosResponse<GetMarketsResponseValue>> {
    return httpClient.get('/api/v1/markets/otc');
  },

  getMarketsExchange(): Promise<AxiosResponse<GetMarketsResponseValue>> {
    return httpClient.get('/api/v1/markets/exchange');
  },

  getPrice(marketId: string): Promise<AxiosResponse<GetPriceResponseValue>> {
    return httpClient.get(`/api/v1/markets/price?marketId=${marketId}`);
  },
};
