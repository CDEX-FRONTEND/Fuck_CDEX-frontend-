import { AxiosResponse } from 'axios';
import { StringLiteralLike } from 'typescript';
import {
  MarketType,
  OrderType,
  OrderTypeProps,
  ParamsType,
} from '../../store/orderSlice';
import { httpClient } from '../httpClient';

export interface GetMarketResponseValue {
  market: MarketType[];
}

export interface GetOrderResponseValue {
  orders: OrderType[];
}

export interface CalcEffectivePriceRequestValues {
    side: 'ask' | 'bid';
    by: string;
    volume: number;
    amount: number;
    marketId: string;
}

export interface CalcEffectivePriceResponseValue {
  price: StringLiteralLike;
}

export const orderService = {
  createOrder(order: OrderTypeProps): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/orders', order);
  },

  getMarket(): Promise<AxiosResponse<GetMarketResponseValue>> {
    return httpClient.get('/api/v1/orders/market');
  },

  cancelOrder(orderId: string): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/orders/cancel', { orderId });
  },

  getMy(params: ParamsType): Promise<AxiosResponse<GetOrderResponseValue>> {
    return httpClient.get('/api/v1/orders/my', { params });
  },

  getMyComplete(
    params: ParamsType
  ): Promise<AxiosResponse<GetOrderResponseValue>> {
    return httpClient.get('/api/v1/orders/my-complete', { params });
  },

  calcEffectivePrice(
    params: CalcEffectivePriceRequestValues
  ): Promise<AxiosResponse<CalcEffectivePriceResponseValue>> {
    return httpClient.get('/api/v1/orders/calculate-effective-price', {
      params,
    });
  },
};
