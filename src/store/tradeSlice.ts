import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { GetAdvertisementFee, tradeService } from '../services/api/trade';
import { AdvertisementType } from './otcSlice';

export type TradeType = {
  side: string;
  created_at: number;
  volume: number;
  amount: number;
  price: number;
  marketId: string;
  feeSum: number;
  feeSumCurrencyId: string;
  advertisement: AdvertisementType;
};

export type ParamsType = {
  page: number;
  take: number;
};

export type TradeFee = {
  percent: number;
  feeSum: number;
  feeCurrencyId: string
};


type TradeSliceInitialStateType = {
  my: TradeType[];
  loading: boolean;
  last: TradeType[];
  tradeFee: TradeFee | null
};

const initialState: TradeSliceInitialStateType = {
  my: [],
  loading: false,
  last: [],
  tradeFee: null
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setMy(state, { payload }) {
      state.my = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setLast(state, { payload }) {
      state.last = payload;
    },
    setTradeFee(state, { payload }) {
      state.tradeFee = payload;
    },
  },
});

export const { setMy, setLoading, setLast, setTradeFee } = tradeSlice.actions;

export const getMyTrades = createAsyncThunk(
  'trade/getMy',
  async (params: ParamsType, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await tradeService.getMy(params);
      if (response.status === 200) {
        dispatch(setMy(response.data));
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

export const getLastTrades = createAsyncThunk(
  'trade/getLast',
  async (_: ParamsType, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await tradeService.getLast();
      if (response.status === 200) {
        dispatch(setLast(response.data));
      }
    } catch (err) {
      //const { response } = err;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getAdvertisementFee = createAsyncThunk(
  'otc/getAdvertisementFee',
  async (requestValues: GetAdvertisementFee, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      const response = await tradeService.getAdvertisementFee(requestValues);
      dispatch(setTradeFee(response.data));

    } catch (err) { }
    finally {
      dispatch(setLoading(false));
    }
  }
);

export const selectLastTrades = (state: RootState) => state.trade.last;
export const selectMyTrades = (state: RootState) => state.trade.my;
export const selectMyTradeFee = (state: RootState) => state.trade.tradeFee;

export default tradeSlice.reducer;
