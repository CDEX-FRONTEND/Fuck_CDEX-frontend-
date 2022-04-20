import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { marketService } from '../services/api/market';

export type CurrencyType = {
  id: string;
  isCoin: boolean;
};

export type MarketType = {
  id: string;
  mainCurrencyId: string;
  paidCurrencyId: string;
  minMain: 0;
  minPaid: 0;
  orderType: string;
  feeBuyCurrencyId: string;
  feeSellCurrencyId: string;
  marketMakerFeeSell: number;
  marketTakerFeeSell: number;
  marketMakerFeeBuy: number;
  marketTakerFeeBuy: number;
  mainCurrency: CurrencyType;
  paidCurrency: CurrencyType;
};

export type PriceType = {
  price: number;
  askPrice: number;
  bidPrice: number;
};

type MarketSliceInitialStateType = {
  markets: MarketType[];
  loading: boolean;
  price: PriceType | null;
};

const initialState: MarketSliceInitialStateType = {
  markets: [],
  loading: false,
  price: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarkets(state, { payload }) {
      state.markets = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setPrice(state, { payload }) {
      state.price = payload;
    },
  },
});

export const { setMarkets, setLoading, setPrice } = marketSlice.actions;

export const getMarkets = createAsyncThunk(
  'market/getMarkets',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await marketService.getMarkets();
    if (response.status === 200) {
      dispatch(setMarkets(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const getMarketsOtc = createAsyncThunk(
  'market/getMarketsOtc',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await marketService.getMarketsOtc();
    if (response.status === 200) {
      dispatch(setMarkets(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const getMarketsExchange = createAsyncThunk(
  'market/getMarketsExchange',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await marketService.getMarketsExchange();
    if (response.status === 200) {
      dispatch(setMarkets(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const getPrice = createAsyncThunk(
  'market/getPrice',
  async (marketId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await marketService.getPrice(marketId);
      if (response.status === 200) {
        dispatch(setPrice(response.data));
      } else if (response.status === 400) {
        // ...
      }
    } catch (err) {
      //const { response } = err;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const selectMarkets = (state: RootState) => state.market.markets;
export const selectPrice = (state: RootState) => state.market.price;

export default marketSlice.reducer;
