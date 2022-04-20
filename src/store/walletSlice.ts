import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { type } from 'os';
import { AppDispatch, RootState } from '.';
import {
  CryptoFeeProps,
  GetMyTransactionsProps,
  TransactionListProps,
  walletService,
} from '../services/api/wallet';

export type AdressWallet = {
  network: string;
  address: string;
};


export type FullCodeProps = {
  id: string
}

export type WalletType = {
  id: string;
  name: string;
  currency_id: string;
  service_balance: number;
  held_balance: number;
  real_address: AdressWallet[];
  isCoin: boolean;
};

export type HistoryType = {
  id: string;
  balance: number;
  createdAt: number;
  operatorId: string;
  type: string;
  desc: string;
  walletId: string;
};

export type BalanceUpdateProps = {
  walletId: string;
  deltaBalance: string;
  type: string;
  desc: string;
};

export type DepositWithCode = {
  code: string;
};

export type CryptoOutProps = {
  walletId: string;
  volume: string;
  volumeFee: string;
  address: string;
  networkId: string;
};

export type CreationCodeType = {
  currency: string;
  amount: string;
}

export type TransactionListType = {
  id: string;
  userId: string;
  userName: string;
  walletId: string;
  currencyId: string;
  status: string;
  addressFrom: string;
  addressTo: string;
  direction: string;
  txId: string;
  amount: string;
  feeBlockchain: number;
  feeService: string;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  userId: string;
  userName: string;
  walletId: string;
  currencyId: string;
  status: string;
  addressFrom: string;
  addressTo: string;
  direction: string;
  txId: string;
  amount: string;
  feeBlockchain: number;
  feeService: string;
  createdAt: string;
  updatedAt: string;
  networkId: string;
};

export type CryptoFeeType = {
  fee: string;
  feeHigh: string;
  feeVeryHigh: string;
  currencyId: string;
};

export type CurencyListType = {
  id: string;
  isCoin: boolean;
  precision: string;
};

export type ListCodeType = {
  amount: string;
  code: string;
  createdAt: string;
  currencyId: string;
  id: string
}

type WalletSliceInitialStateType = {
  listCode: ListCodeType[],
  wallets: WalletType[];
  adress: AdressWallet[];
  loading: boolean;
  actualAddress: AdressWallet[];
  walletHistory: HistoryType[];
  summary: number;
  curencyList: CurencyListType[];
  summaryUpdated: string;
  fullCode: string | null;
  transactionList: Transaction[];
  myTransactions: Transaction[];
  myTransactionsCount: number;
  lastError: string | null;
  cryptoFee: CryptoFeeType | null;
  outFee: string;
  transaction: Transaction | null;
  code: string | null;
};

const initialState: WalletSliceInitialStateType = {
  listCode: [],
  wallets: [],
  adress: [],
  fullCode: null,
  loading: false,
  actualAddress: [],
  walletHistory: [],
  curencyList: [],
  summary: 0,
  summaryUpdated: '0',
  transactionList: [],
  myTransactions: [],
  myTransactionsCount: 0,
  lastError: null,
  cryptoFee: null,
  outFee: '0.0000',
  transaction: null,
  code: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setListCode(state, { payload }) {
      state.listCode = payload;
    },
    setWallets(state, { payload }) {
      state.wallets = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setActualAddress(state, { payload }) {
      state.actualAddress = payload;
    },
    setHistory(state, { payload }) {
      state.walletHistory = payload;
    },
    setSummary(state, { payload }) {
      state.summary = payload;
    },
    setCurrencyList(state, { payload }) {
      state.curencyList = payload;
    },
    setTransactionList(state, { payload }) {
      state.transactionList = payload;
    },
    setSummaryUpdated(state, { payload }) {
      state.summaryUpdated = payload;
    },
    setMyTransactions(state, { payload }) {
      state.myTransactions = payload;
    },
    setMyTransactionsCount(state, { payload }) {
      state.myTransactionsCount = payload;
    },
    setLastError(state, { payload }) {
      state.lastError = payload;
    },
    setCryptoFee(state, { payload }) {
      state.cryptoFee = payload;
    },
    setOutFee(state, { payload }) {
      state.outFee = payload;
    },
    setTransaction(state, { payload }) {
      state.transaction = payload;
    },
    setCode(state, { payload }) {
      state.code = payload;
    },
    setFullCode(state, { payload }) {
      state.fullCode = payload;
    },
    todoNull() {},
  },
});

export const {
  setWallets,
  setLoading,
  setActualAddress,
  setHistory,
  setSummary,
  setTransactionList,
  setSummaryUpdated,
  setMyTransactions,
  setMyTransactionsCount,
  setLastError,
  setCryptoFee,
  setCurrencyList,
  setOutFee,
  setTransaction,
  todoNull,
  setCode,
  setListCode,
  setFullCode
} = walletSlice.actions;

export const getWallets = createAsyncThunk(
  'wallet/getWallets',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getWallets();
    if (response.status === 200) {
      dispatch(setWallets(response.data.wallets));
    }

    dispatch(setLoading(false));
  }
);

export const getTransactionList = createAsyncThunk(
  'wallet/transactions/list',
  async (props: TransactionListProps, { dispatch }) => {
    const response = await walletService.getTransactionList(props);
    if (response.status === 200) {
      dispatch(setTransactionList(response.data.data));
    }
  }
);

export const getMyTransactions = createAsyncThunk(
  'wallet/transactions/list/my',
  async (props: GetMyTransactionsProps, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getMyTransactions(props);

    if (response.status === 200) {
      dispatch(setMyTransactionsCount(response.data.total));
      dispatch(setMyTransactions(response.data.data));
    }

    dispatch(setLoading(false));
  }
);

export const getTransaction = createAsyncThunk(
  'wallet/transaction',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getTransaction(id);

    if (response.status === 200) {
      dispatch(setTransaction(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const postCreateCode = createAsyncThunk(
  'code/create',
  async (props: CreationCodeType, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.postCreateCode(props);

    if (response.status === 200) {
      dispatch(setCode(response.data));
    }

    dispatch(setLoading(false));
    return response.data
  }
);

export const getFullCode = createAsyncThunk(
  'code/full',
  async (props: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getFullCode(props);
    if (response.status === 200 || response.status === 201) {
      dispatch(setFullCode(response.data));
      return response.data
    }

    dispatch(setLoading(false));
  }
);


export const getListMyCode = createAsyncThunk(
  'code/my',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getListMyCode();
    if (response.status === 200) {
      dispatch(setListCode(response.data));
    }

    dispatch(setLoading(false));
    return response.data
  }
);

// export const redemCode = createAsyncThunk(
//   'code/full',
//   async (props: FullCodeProps, { dispatch }) => {
//     dispatch(setLoading(true));

//     const response = await walletService.getFullCode(props);

//     if (response.status === 200) {
//       dispatch(setCode(response.data));
//     }

//     dispatch(setLoading(false));
//     return response.data
//   }
// );

export const getSummary = createAsyncThunk(
  'wallets/summary',
  async (currency: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getSummary(currency);
    if (response.status === 200) {
      dispatch(setSummary(response.data.amount));
      dispatch(setSummaryUpdated(response.data.updatedAt));
    }

    dispatch(setLoading(false));
  }
);

export const getActualAddress = createAsyncThunk(
  'wallet/getActualAddress',
  async (walletId: string, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await walletService.getActualAddress(walletId);
    if (response.status === 200) {
      dispatch(setActualAddress(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const getHistory = createAsyncThunk(
  'wallet/history',
  async (walletId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await walletService.getHistory(walletId);
      if (response.status === 200) {
        dispatch(setHistory(response.data));
      }
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const postBalanceUp = createAsyncThunk(
  'wallet/postBalanceUp',
  async (props: BalanceUpdateProps, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      await walletService.postBalanceUp(props);
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const postBalanceDown = createAsyncThunk(
  'wallet/postBalanceDown',
  async (props: BalanceUpdateProps, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      await walletService.postBalanceDown(props);
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const redeemGiftCode = createAsyncThunk(
  'code/redeem',
  async (requestValues: DepositWithCode, { dispatch }) => {
    dispatch(setLoading(true));
    dispatch(setLastError(null));
    try {
      const response = await walletService.redeemGiftCode(requestValues);
      return response.data;
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) { }
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createCryptoOut = createAsyncThunk(
  'wallet/createCryptoOut',
  async (requestValues: CryptoOutProps, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await walletService.createCryptoOut(requestValues);

      return response.data.transactionId;
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const rejectTransaction = createAsyncThunk<boolean, string, {
  dispatch: AppDispatch
}>(
  'wallet/rejectTransaction',
  async (transactionId: string, { dispatch }) => {
    dispatch(setLoading(true));

    dispatch(setLastError(null));

    try {
      await walletService.rejectTransaction(transactionId);

      return true;
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }

    return false;
  }
);

export const confirmTransaction = createAsyncThunk(
  'wallet/transaction/confirm/{transactionId}',
  async (transactionId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      dispatch(setLastError(null));
      await walletService.confirmTransaction(transactionId);

      return true;
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }

    return false;
  }
);

export const getCryptoFee = createAsyncThunk(
  'wallet/crypto/fee',
  async (props: CryptoFeeProps, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      dispatch(setLastError(null));
      const response = await walletService.getCryptoFee(props);
      if (response.status === 201) {
        dispatch(setCryptoFee(response.data));
      } else {
        dispatch(setLastError(response.data.message));
      }
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getCurrencyList = createAsyncThunk(
  'currency/list',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      dispatch(setLastError(null));
      const response = await walletService.getCurrencyList();
      if (response.status === 200) {
        dispatch(setCurrencyList(response.data));
      } else {
        dispatch(setLastError(response.data.message));
      }
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getOutFee = createAsyncThunk(
  'wallet//getOutFee',
  async (currencyId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      dispatch(setLastError(null));

      const response = await walletService.getOutFee(currencyId);
      if (response.status === 200) {
        if (response.data) {
          dispatch(setOutFee(response.data.value));
        } else {
          dispatch(setOutFee('0.0000'));
        }
      } else {
        dispatch(setLastError(response.data.message));
      }
    } catch (err) {
      try {
        const { response } = err;
        dispatch(setLastError(response?.data?.message));
      } catch (e) {}
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const selectActualAddress = (state: RootState) =>
  state.wallet.actualAddress;
export const selectLoading = (state: RootState) => state.wallet.loading;
export const selectWallets = (state: RootState) => state.wallet.wallets;
export const selectCurrencyList = (state: RootState) =>
  state.wallet.curencyList;
export const selectHistory = (state: RootState) => state.wallet.walletHistory;
export const selectSummary = (state: RootState) => state.wallet.summary;
export const selectSummaryUpdated = (state: RootState) =>
  state.wallet.summaryUpdated;
export const selectTransactionList = (state: RootState) =>
  state.wallet.transactionList;
export const selectMyTransactions = (state: RootState) =>
  state.wallet.myTransactions;
export const selectMyTransactionsCount = (state: RootState) =>
  state.wallet.myTransactionsCount;
export const selectCryptoFee = (state: RootState) => state.wallet.cryptoFee;
export const selectListCode = (state: RootState) => state.wallet.listCode;
export const selectFullCode = (state: RootState) => state.wallet.fullCode;

export default walletSlice.reducer;
