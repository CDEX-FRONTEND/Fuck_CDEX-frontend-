import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '.';
import { adminService, GetUsersRequestValuesType } from '../services/api/admin';

export interface IUser {
  id: {
    _id: string;
  };
  name: string;
  login: {
    _login: string;
  };
  isBanned: boolean;
  userLevel: number;
  lastBanReason: string;
  email: string;
  level: number;
  userIsVerified: boolean;
  otc: {
    countComplete: number;
    countTotal: number;
    averagePaymentTime: number;
  }
  wallet: {
    amount: number;
    currency: string;
    updatedAt: string;
  }
}

type SummaryType = {
  exchange: {
    title: string;
    total: number;
    totalCurrency: string;
    tradeCount: number;
    feeTotal: number;
    feeCurrency: string;
  };
  otc: {
    title: string;
    total: number;
    totalCurrency: string;
    tradeCount: number;
    feeTotal: number;
    feeCurrency: string;
  };
  actives: {
    title: string;
    totalWallet: number;
    totalWalletCurrency: string;
    totalWalletInput: number;
    totalWalletInputCurrency: string;
    totalWalletOutput: number;
    totalWalletOutputCurrency: string;
  };
  users: {
    title: string;
    total: number;
    totalNew: number;
  };
};

type AdminSliceInitialStateType = {
  loading: boolean;
  users: IUser[];
  totalUsers: number;
  user: IUser | null;
  summary: SummaryType | null;
  error: {
    code: number;
    message: string;
  } | null;
};

const initialState: AdminSliceInitialStateType = {
  users: [],
  totalUsers: 0,
  loading: false,
  user: null,
  summary: null,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers(state, { payload }) {
      state.users = payload;
    },
    setTotalUsers(state, { payload }) {
      state.totalUsers = payload
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setUser(state, { payload }) {
      state.user = payload;
    },
    setSummary(state, { payload }) {
      state.summary = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
  },
});

export const { setUsers, setTotalUsers, setLoading, setUser, setSummary, setError } =
  adminSlice.actions;

export const selectUsers = (state: RootState) => state.admin.users;
export const selectTotalUsers = (state: RootState) => state.admin.totalUsers;
export const selectLoading = (state: RootState) => state.admin.loading;
export const selectUser = (state: RootState) => state.admin.user;
export const selectSummary = (state: RootState) => state.admin.summary;

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async ({ page, take, nameFilter, addActiveUsers, addBannedUsers }: GetUsersRequestValuesType, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await adminService.getUsers({
        page,
        take,
        nameFilter,
        addActiveUsers,
        addBannedUsers
      });

      if (response.status === 201) {
        dispatch(setTotalUsers(response.data.total));
        dispatch(setUsers(response.data.users));
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getUser = createAsyncThunk(
  'admin/getUser',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await adminService.getUser(id);
      if (response.status === 200) {
        dispatch(setUser(response.data));
      } else if (response.status === 400) {
      }
    } catch (err) {
      //const { response } = err;
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const getStatistic = createAsyncThunk(
  'admin/statistic',
  async (timeInterval: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await adminService.getStatistic(timeInterval);
      dispatch(setSummary(response.data));
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const banUser = createAsyncThunk(
  'admin/user/ban',
  async (userId: string, { dispatch }) => {
    try {
      await adminService.banUser(userId);

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
    }

    return false;
  }
);

export const unBanUser = createAsyncThunk(
  'admin/user/unban',
  async (userId: string, { dispatch }) => {
    try {
      await adminService.unBanUser(userId);
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
    }
    return false;
  }
);

export default adminSlice.reducer;
