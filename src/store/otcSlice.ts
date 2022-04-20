import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '.';
import {
  CancelDisputeRequestValues,
  CompleteDisputeRequestValues,
  GetTradesRequestValues,
  GetTradeTimerCancelDurationRequestValues,
  otcService,
} from '../services/api/otc';
import { CurrencyType } from './marketSlice';

export enum TradeStatusEnum {
  OPEN_WAIT_CONFIRM = 'open:wait-confirm',
  OPEN_CONFIRM = 'open:confirm',
  OPEN = 'open',
  SEND_PAYMENT_DETAILS = 'send-payment-details',
  SEND_PAYMENT_DOCUMENT = 'send-payment-document',
  CONFIRM_SELLER = 'confirm:seller',
  CONFIRM_BUYER = 'confirm:buyer',
  CONFIRM = 'confirm',
  COMPLETE = 'complete',
  ERROR = 'error',
  CANCEL = 'cancel',
  DISPUTE_OPEN = 'dispute:open',
  DISPUTE_RESOLVE_SELLER = 'dispute:resolve_seller',
  DISPUTE_RESOLVE_BUYER = 'dispute:resolve_buyer',
  DISPUTE_RESOLVE_BOTH = 'dispute:resolve_both',
  DISPUTE_COMPLETE = 'dispute:complete',
}

export enum AdvertisementSideEnum {
  ASK = 'ask',
  BID = 'bid',
}

export type PaymentMethodType = {
  id: string;
  name: string;
};

export type GetPaymentMethodListParamsType = {
  page: number;
  take?: number;
};

export type UserType = {
  userId: string;
  name: string;
  level: number;
  userIsVerified: boolean;
  answerRate: string;
};

export type MarketType = {
  id: string;
  mainCurrencyId: string;
  paidCurrencyId: string;
  mainCurrency: CurrencyType;
  paidCurrency: CurrencyType;
};

export type AdvertisementType = {
  id: string;
  marketId: string;
  volume: number;
  volumeMax: number;
  factor: number;
  idNumber: number;
  side: string;
  paymentMethods: PaymentMethodType[];
  description: string;
  privateMode: string;
  userId: string;
  user: UserType;
  fee: number;
  status: string;
  market: MarketType;
  conditionsTrade?: string;
};

export type AdvertisementPropsType = {
  marketId: string;
  volume: number;
  volumeMax: number;
  factor: number;
  side: string;
  paymentMethodIds: string[];
  description: string;
  privateMode: string;
  conditionsTrade?: string;
};

export interface IFilter {
  field: string;
  operator: string;
  value: string | boolean | number | string[] | number[] | boolean[];
}

export interface IOrder {
  field: string;
  direction: string;
}

export interface IGetAdvertisementListRequestValues {
  userId?: string;
  marketId?: string;
  side?: string;
  paymentMethodId?: string;
  status?: string;
  page?: number;
  take?: number;
  filters?: IFilter[];
  orders?: IOrder[];
}

export interface GetMyAdvertisementsRequestValues {
  page: number;
  take: number;
  statuses?: string[];
  filters?: IFilter[];
  orders?: IOrder[];
}

export type FavoriteType = {
  userId: string;
  name: string;
  level: number;
  userIsVerified: boolean;
  answerRate: string;
  countComplete: number;
  countTotal: number;
  countWithMe: number;
  averagePaymentTime: number;
};

export type FavoriteListType = {
  data: FavoriteType[];
  page: number;
  take: number;
  total: number;
};

export type FavoriteListParamsType = {
  page: number;
  take: number;
};

type RoomType = {
  id: string;
  name: string;
  createAt: string;
  countUnreadedMessages: number;
};

export type AdvertisementChatType = {
  advertisementId: string;
  room: RoomType;
  users: UserType[];
  tradeIdNumber: string;
  userId: string;
  tradeId: string;
  advertisement: AdvertisementType;
};

export type GetAdvertisementChatListParamsType = {
  page: number;
  take: number;
};

export type OpenWaitConfirmTradeType = {
  advertisementId: string;
  roomId: string;
  volume: number;
};

export type OpenConfirmTradeType = {
  advertisementId: string;
  tradeId: string;
};

export type SendPaymentDetailsTradeType = {
  tradeId: string;
  message: string;
  paymentMethodId: string;
};

export type TradeType = {
  id: string;
  volume: number;
  amount: number;
  createdAt: number;
  status: string;
  bidUserId: string;
  askUserId: string;
  idNumber: number;
  roomId: string;
  advertisementId: string;
  price: number;
  advertisement: AdvertisementType;
  askUser: UserType;
  bidUser: UserType;
  sumFee: number;
  feeSumCurrencyId: string;
};

export type GetMyTradeListParamsType = {
  status: string;
  page: number;
  take: number;
  orders?: {
    field: string;
    direction: string;
  }[];
};

export type TradeInfoType = {
  id: string;
  volume: number;
  amount: number;
  createdAt: number;
  status: string;
  bidUserId: string;
  askUserId: string;
  roomId: string;
  advertisementId: string;
  price: number;
  advertisement: AdvertisementType;
  askUser: UserType;
  bidUser: UserType;
  side: string;
  conditions: string;
};

export type AdvertisementSellerInfoType = {
  userId: string;
  name: string;
  level: number;
  userIsVerified: boolean;
  answerRate: string;
  countComplete: number;
  countTotal: number;
  averagePaymentTime: number;
  isBanned: boolean;
};

interface IOtcSliceInitialState {
  loading: boolean;
  paymentMethods: PaymentMethodType[];
  paymentMethod: PaymentMethodType | null;
  advertisementList: AdvertisementType[];
  advertisementSellerInfo: AdvertisementSellerInfoType | null;
  advertisement: AdvertisementType | null;
  createAdvertisementSuccess: boolean;
  advertisementChat: AdvertisementChatType | null;
  tradeChat: AdvertisementChatType | null;
  advertisementChatList: AdvertisementChatType[];
  trades: TradeType[];
  tradeStatus: string | null;
  tradeInfo: TradeInfoType | null;
  favoriteList: FavoriteListType | null;
  favorite: FavoriteType[];
  error: {
    code: number;
    message: string;
  } | null;
  tradeTimerCancelDurationSeconds: number;
  totalAdvertisements: number;
}

const initialState: IOtcSliceInitialState = {
  loading: false,
  paymentMethods: [],
  paymentMethod: null,
  advertisementList: [],
  advertisementSellerInfo: null,
  createAdvertisementSuccess: false,
  advertisement: null,
  advertisementChat: null,
  tradeChat: null,
  advertisementChatList: [],
  trades: [],
  tradeStatus: null,
  tradeInfo: null,
  error: null,
  favoriteList: null,
  favorite: [],
  tradeTimerCancelDurationSeconds: 0,
  totalAdvertisements: 0,
};

const otcSlice = createSlice({
  name: 'otc',
  initialState,
  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setPaymentMethods(state, { payload }) {
      state.paymentMethods = payload;
    },
    setPaymentMethod(state, { payload }) {
      state.paymentMethod = payload;
    },
    setAdvertisementList(state, { payload }) {
      state.advertisementList = payload;
    },
    setAdvertisement(state, { payload }) {
      state.advertisement = payload;
    },
    setCreateAdvertisementSuccess(state, { payload }) {
      state.createAdvertisementSuccess = payload;
    },
    setAdvertisementSellerInfo(state, { payload }) {
      state.advertisementSellerInfo = payload;
    },
    setAdvertisementChat(state, { payload }) {
      state.advertisementChat = payload;
    },
    setTradeChat(state, { payload }) {
      state.tradeChat = payload;
    },
    setAdvertisementChatList(state, { payload }) {
      state.advertisementChatList = payload;
    },
    setMyTradeList(state, { payload }) {
      state.trades = payload;
    },
    setTradeStatus(state, { payload }) {
      state.tradeStatus = payload;
    },
    setTradeInfo(state, { payload }) {
      state.tradeInfo = payload;
    },
    resetTradeInfo(state) {
      state.tradeInfo = null;
    },
    resetChat(state) {
      state.advertisementChat = null;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    setFavoriteList(state, { payload }) {
      state.favoriteList = payload;
    },
    setFavorite(state, { payload }) {
      state.favorite = payload;
    },
    setTrades(state, { payload }) {
      state.trades = payload;
    },
    setTradeTimerCancelDurationSeconds(state, { payload }) {
      state.tradeTimerCancelDurationSeconds = payload;
    },
    setTotalAdvertisements(state, { payload }) {
      state.totalAdvertisements = payload;
    },
  },
});

export const {
  setLoading,
  setPaymentMethods,
  setPaymentMethod,
  setAdvertisementList,
  setAdvertisementSellerInfo,
  setAdvertisement,
  setAdvertisementChat,
  setTradeChat,
  setAdvertisementChatList,
  setMyTradeList,
  setTradeStatus,
  setTradeInfo,
  setError,
  resetTradeInfo,
  resetChat,
  setFavoriteList,
  setFavorite,
  setCreateAdvertisementSuccess,
  setTrades,
  setTradeTimerCancelDurationSeconds,
  setTotalAdvertisements,
} = otcSlice.actions;

/**
 * Получает список всем платежных методов.
 */
export const getPaymentMethods = createAsyncThunk(
  'otc/getPaymentMethods',
  async (requestValues: GetPaymentMethodListParamsType, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.getPaymentMethods(requestValues);
    if (response.status === 200) {
      dispatch(setPaymentMethods(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const getPaymentMethod = createAsyncThunk(
  'otc/getPaymentMethod',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.getPaymentMethod(id);
    if (response.status === 200) {
      dispatch(setPaymentMethod(response.data.method));
    }

    dispatch(setLoading(false));
  }
);

export const updatePaymentMethod = createAsyncThunk(
  'otc/updatePaymentMethod',
  async (paymentMethod: PaymentMethodType, { dispatch }) => {
    dispatch(setLoading(true));

    await otcService.updatePaymentMethod(paymentMethod);

    dispatch(setLoading(false));
  }
);

/**
 *
 */
export const getAdvertisementList = createAsyncThunk(
  'otc/getAdvertisementList',
  async (requestValues: IGetAdvertisementListRequestValues, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await otcService.getAdvertisementList(requestValues);
      if (response && response.status === 201 && response.data) {
        dispatch(setTotalAdvertisements(response.data.total));
        dispatch(setAdvertisementList(response.data.data));
      }
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 *
 */
export const getMyAdvertisementList = createAsyncThunk(
  'otc/getMyAdvertisementList',
  async (requestValues: GetMyAdvertisementsRequestValues, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await otcService.getMyAdvertisementList(requestValues);
    if (response && response.status === 201 && response.data) {
      dispatch(setAdvertisementList(response.data.data));
      dispatch(setTotalAdvertisements(response.data.total));
    }
    dispatch(setLoading(false));
  }
);

/**
 *
 */
export const getAdvertisementSellerInfo = createAsyncThunk(
  'otc/getAdvertisementSellerInfo',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await otcService.getAdvertisementSellerInfo(id);
    if (response.status === 200) {
      dispatch(setAdvertisementSellerInfo(response.data));
    }
    dispatch(setLoading(false));
  }
);

export const getAdvertisement = createAsyncThunk(
  'otc/getAdvertisement',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      const response = await otcService.getAdvertisement(id);
      if (response.status === 200) {
        dispatch(setAdvertisement(response.data));
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        dispatch(
          setError({
            code: err.response.data.code,
            message: err.response.data.message,
          })
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createAdvertisement = createAsyncThunk(
  'otc/createAdvertisement',
  async (requestValues: AdvertisementPropsType, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await otcService.createAdvertisement(requestValues);

      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        dispatch(
          setError({
            code: err.response.data.code,
            message: err.response.data.message,
          })
        );
      }
    } finally {
      dispatch(
        getMyAdvertisementList({
          page: 1,
          take: 20,
          filters: [{field: "status", operator: "in", value: ["active"]}],
        })
      );
    }
    return false;
  }
);

export const changeAdvertisementStatus = createAsyncThunk(
  'otc/changeAdvertisementStatus',
  async (_: any, { dispatch }) => {
    dispatch(setLoading(true));
    await otcService.createAdvertisement(_);
    dispatch(setLoading(false));
  }
);

export const cancelAdvertisement = createAsyncThunk(
  'otc/cancelAdvertisement',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      await otcService.cancelAdvertisement(id);

      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (axios.isAxiosError(err) && err.response) {
          dispatch(
            setError({
              code: err.response.data.code,
              message: err.response.data.message,
            })
          );
        }
      }
    } finally {
      dispatch(setLoading(false));
    }

    return false;
  }
);

export const getAdvertisementChat = createAsyncThunk(
  'otc/getAdvertisementChat',
  async (advertisementId: string, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await otcService.getAdvertisementChat(advertisementId);
    if ([200, 201].includes(response.status)) {
      dispatch(setAdvertisementChat(response.data));
    }
    dispatch(setLoading(false));
  }
);

export const getTradeChat = createAsyncThunk(
  'otc/getTradeChat',
  async (tradeId: string, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await otcService.getTradeChat(tradeId);
    if ([200, 201].includes(response.status)) {
      dispatch(setTradeChat(response.data));
    }
    dispatch(setLoading(false));
  }
);

export const getAdvertisementChatList = createAsyncThunk(
  'otc/getAdvertisementChatList',
  async (params: GetAdvertisementChatListParamsType, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await otcService.getAdvertisementChatList(params);
      if (response.status === 200) {
        dispatch(
          setAdvertisementChatList(
            response.data.sort((first: any, second: any) => {
              return (
                (!!second.room.countUnreadedMessages ? 1 : 0) -
                (!!first.room.countUnreadedMessages ? 1 : 0)
              );
            })
          )
        );
      }
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const openWaitConfirmTrade = createAsyncThunk(
  'otc/openWaitConfirmTrade',
  async (trade: OpenWaitConfirmTradeType, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.openWaitConfirmTrade(trade);
    if (response.status === 200) {
      //
    }

    dispatch(setLoading(false));
  }
);

export const openConfirmTrade = createAsyncThunk(
  'otc/openConfirmTrade',
  async (trade: OpenConfirmTradeType, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      await otcService.openConfirmTrade(trade);
    } catch (err) {
      const { response }: any = err;
      dispatch(
        setError({
          code: response.data.code,
          message: response.data.message,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const sendPaymentDetailsTrade = createAsyncThunk(
  'otc/sendPaymentDetailsTrade',
  async (trade: SendPaymentDetailsTradeType, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.sendPaymentDetailsTrade(trade);
    if (response.status === 200) {
      //
    }

    dispatch(setLoading(false));
  }
);

export const sendPaymentDocumentTrade = createAsyncThunk(
  'otc/sendPaymentDocumentTrade',
  async (tradeId: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.sendPaymentDocumentTrade(tradeId);
    if (response.status === 200) {
      //
    }

    dispatch(setLoading(false));
  }
);

export const confirmTrade = createAsyncThunk(
  'otc/confirmTrade',
  async (tradeId: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.confirmTrade(tradeId);
    if (response.status === 200) {
      //
    }

    dispatch(setLoading(false));
  }
);

export const disputeTrade = createAsyncThunk(
  'otc/disputeTrade',
  async (tradeId: string, { dispatch }) => {
    dispatch(setLoading(true));

    await otcService.disputeTrade(tradeId);

    dispatch(setLoading(false));
  }
);

export const cancelTrade = createAsyncThunk(
  'otc/cancelTrade',
  async (tradeId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      await otcService.cancelTrade(tradeId);

      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
      }
    } finally {
      dispatch(setLoading(false));
    }

    return false;
  }
);

export const getMyTrades = createAsyncThunk(
  'otc/getMyTradeList',
  async (params: GetMyTradeListParamsType, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.getMyTrades(params);
    if (response.status === 201) {
      dispatch(setMyTradeList(response.data.trades));
    }

    dispatch(setLoading(false));
  }
);

export const getTradeStatus = createAsyncThunk(
  'otc/getTradeStatus',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await otcService.getTradeStatus(id);
    if (response.status === 200) {
      dispatch(setTradeStatus(response.data.status));
    }

    dispatch(setLoading(false));
  }
);

export const getTradeInfo = createAsyncThunk(
  'otc/getTradeInfo',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await otcService.getTradeInfo(id);
    if (response.status === 200) {
      dispatch(setTradeInfo(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const getMyFavoriteList = createAsyncThunk(
  'otc/getMyFavoriteList',
  async (params: FavoriteListParamsType, { dispatch }) => {
    try {
      const response = await otcService.getMyFavoriteList(params);
      if (response.status === 200) {
        dispatch(setFavorite(response.data.data));
      }
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getTrades = createAsyncThunk(
  'otc/getTrades',
  async (requestValues: GetTradesRequestValues, { dispatch }) => {
    try {
      const response = await otcService.getTrades(requestValues);
      if (response.status >= 200 && response.status < 300) {
        dispatch(setTrades(response.data.trades));
      }
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const cancelDispute = createAsyncThunk(
  'otc/cancelDispute',
  async (params: CancelDisputeRequestValues, { dispatch }) => {
    //dispatch(setLoading(true))
    try {
      await otcService.cancelDispute(params);
    } catch (err) {
    } finally {
      //dispatch(setLoading(false));
    }
  }
);

export const completeDispute = createAsyncThunk(
  'otc/completeDispute',
  async (params: CompleteDisputeRequestValues, { dispatch }) => {
    //dispatch(setLoading(true))
    try {
      await otcService.completeDispute(params);
    } catch (err) {
    } finally {
      //dispatch(setLoading(false));
    }
  }
);

/**
 * Get time to trade timer expired
 */
export const getTradeTimerCancelDuration = createAsyncThunk(
  'otc/getTradeTimerCancelDuration',
  async (
    requestValues: GetTradeTimerCancelDurationRequestValues,
    { dispatch }
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await otcService.getTradeTimerCancelDuration(
        requestValues
      );
      dispatch(
        setTradeTimerCancelDurationSeconds(response.data.durationSeconds)
      );
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const selectPaymentMethods = (state: RootState) =>
  state.otc.paymentMethods;
export const selectAdvertisements = (state: RootState) =>
  state.otc.advertisementList;

export const selectAdvertisement = (state: RootState) =>
  state.otc.advertisement;

export const selectCreateAdvertisementSuccess = (state: RootState) =>
  state.otc.createAdvertisementSuccess;

export const selectAdvertisementChat = (state: RootState) =>
  state.otc.advertisementChat;

export const selectTradeChat = (state: RootState) => state.otc.tradeChat;

export const selectTrades = (state: RootState) => state.otc.trades;

export const selectTradeInfo = (state: RootState) => state.otc.tradeInfo;

export const selectAdvertisementSellerInfo = (state: RootState) =>
  state.otc.advertisementSellerInfo;

export const selectFavoriteList = (state: RootState) => state.otc.favorite;

export const selectError = (state: RootState) => state.otc.error;

export default otcSlice.reducer;
