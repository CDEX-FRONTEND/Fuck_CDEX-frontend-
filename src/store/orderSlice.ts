import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { orderService } from '../services/api/order';
import { IError } from './authSlice';

export type OrderTypeProps = {
  market: string;
  orderType: string;
  side: string;
  by: string;
  volume: string;
  amount: string;
  factor: string;
  fixPrice: string;
};

export type OrderType = {
  type: string;
  price: string;
  volume: string;
  amount: string;
  orderId: string;
  market_id: string;
  side: string;
  factor: string;
  status: string;
  created_at: number;
  target: string;
  executedVolume: string;
  executedAmount: string;
};

type MarketFieldType = {
  type: string;
  price: string;
  volume: string;
  amount: string;
};

export type MarketType = {
  marketId: string;
  ask: MarketFieldType[];
  bid: MarketFieldType[];
};

export type ParamsType = {
  marketId?: string;
  coin?: boolean;
  page?: number;
  take?: number;
};

interface IOrderSliceInitialState {
  my: OrderType[];
  myComplete: OrderType[];
  market: MarketType[];
  loading: boolean;
  orderCreated: boolean;
  error: IError | null;
}

const initialState: IOrderSliceInitialState = {
  my: [],
  myComplete: [],
  market: [],
  loading: false,
  orderCreated: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setMy(state, { payload }) {
      state.my = payload;
    },
    setMyComplete(state, { payload }) {
      state.myComplete = payload;
    },
    setMarket(state, { payload }) {
      state.market = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    setOrderCreated(state, { payload }) {
      state.orderCreated = payload;
    },
    removeOrder(state, { payload }) {
      state.my = state.my.filter((order) => order.orderId !== payload);
    },
  },
});

// actions
export const {
  setMy,
  setMyComplete,
  setMarket,
  setLoading,
  setError,
  setOrderCreated,
  removeOrder,
} = orderSlice.actions;

// async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order: OrderTypeProps, { dispatch }) => {
    try {
      dispatch(setOrderCreated(false));
      dispatch(setError(null));
      dispatch(setLoading(true));
      await orderService.createOrder(order);
      dispatch(setOrderCreated(true));
      dispatch(getMarket());
    } catch (err) {
      try {
        // eslint-disable-next-line no-use-before-define
        const { response } = err;

        dispatch(
          setError({
            code: response.data.code,
            message: response.data.message,
          })
        );
      } catch (err) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getMarket = createAsyncThunk(
  'order/getMarket',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await orderService.getMarket();
    if (response.status === 200) {
      dispatch(setMarket(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      try {
        await orderService.cancelOrder(orderId);
      } catch (err) {}
    } catch (err) {}
  }
);

export const getMyOrders = createAsyncThunk(
  'order/getMy',
  async (params: ParamsType, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await orderService.getMy(params);
      if (response.status === 200) {
        dispatch(setMy(response.data.orders));
      }
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getMyComplete = createAsyncThunk(
  'order/getMyComplete',
  async (params: ParamsType, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await orderService.getMyComplete(params);
    if (response.status === 200) {
      dispatch(setMyComplete(response.data.orders));
    }

    dispatch(setLoading(false));
  }
);

export const calcEffectivePrice = createAsyncThunk(
  'orders/calcEffectivePrice',
  async (
    params: {
      side: 'ask' | 'bid';
      by: string;
      volume: number;
      amount: number;
      marketId: string;
    },
    { dispatch }
  ) => {
    dispatch(setLoading(true));

    try {
      const response = await orderService.calcEffectivePrice(params);
      if (response.status === 200) {
        return response.data.price;
      }
    } catch (err) {
      console.log(err);
    }

    dispatch(setLoading(false));

    return null;
  }
);

// selectors
export const selectMarket = (state: RootState) => state.order.market;
export const selectMyOrders = (state: RootState) => state.order.my;
export const selectError = (state: RootState) => state.order.error;
export const selectOrderCreated = (state: RootState) =>
  state.order.orderCreated;
export const selectLoading = (state: RootState) => state.order.loading;

export default orderSlice.reducer;
