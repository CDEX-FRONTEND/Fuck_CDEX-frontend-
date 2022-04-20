import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../services/api/user";
import { AppThunk, RootState } from ".";
import { IError } from "./authSlice";

export type UserRoleType = {
  code: string;
  description: string;
  name: string;
};

export type UserType = {
  id: string;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  is2FAEnabled: boolean;
  isVerifiedKYC: boolean;
  login: string;
  name: string;
  roles: UserRoleType[];
};

export type UsersFavorite = {
  id: string;
  name: string;
  isVerifiedKYC: boolean;
}

export type UsersFavoriteList = {
  page: number;
  take: number;
  total: number;
  data: UsersFavorite[];
}

export type IsUserFavoriteParamsType = {
  userIds: string []
}

export type IsUserFavoriteType = {
  userId: string;
  isFavorite: boolean;
}

type UserSliceInitialState = {
  user: UserType | null;
  loading: boolean;
  error?: IError | null;
  nameChanged: boolean;
  addToFavorite: boolean;
  isUserFavorite: IsUserFavoriteType [];
  UsersFavoriteList: UsersFavoriteList | null
};

const initialState: UserSliceInitialState = {
  user: null,
  loading: false,
  error: null,
  nameChanged: false,
  addToFavorite: false,
  isUserFavorite: [],
  UsersFavoriteList: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    setNameChanged(state, { payload }) {
      state.nameChanged = payload;
    },
    setAddToFavorite(state, {payload}) {
      state.addToFavorite = payload;
    },
    setIsUserFavorite(state, {payload}) {
      state.isUserFavorite = payload
    },
    setUsersFavoriteList(state, {payload}) {
      state.UsersFavoriteList = payload
    }
  },
});

export const {
  setUser,
  setLoading,
  setError,
  setNameChanged,
  setAddToFavorite,
  setIsUserFavorite,
  setUsersFavoriteList,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectIsFavorite = (state: RootState) => state.user.isUserFavorite;
export const selectUsersFavoriteList = (state: RootState) => state.user.UsersFavoriteList;

export const getMe = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await userService.getMe();
    if (response.status === 200) {
      dispatch(setUser(response.data));
    }
  } catch (err) {
    //const { response } = err
  } finally {
    dispatch(setLoading(false));
  }
};

export const getUsersFavoriteList = 
  (): AppThunk =>
  async(dispatch) => {
    try{
      dispatch(setLoading(true));
      const response = await userService.getFavoriteUsers();
      if (response.status === 200 ){
        dispatch(setUsersFavoriteList(response.data.data));
      }
    }catch(err){

    }finally{
      dispatch(setLoading(false));
    }
  }

export const getIsFavoriteUser =
  (params: IsUserFavoriteParamsType): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await userService.getIsFavoriteUser(params);
      if (response.status === 200) {
        dispatch(setIsUserFavorite(response.data));
      }
    } catch (err) {
    } finally {
      dispatch(setLoading(false));
    }
  };

export const addFavoriteUser = createAsyncThunk(
  'user/addFavoriteUser',
  async(id: string, {dispatch}) => {
    dispatch(setLoading(true));
    const response = await userService.addFavoriteUser(id);
    if (response.status === 200) {

    }

    dispatch(setLoading(false));
  }
);

export const removeFavoriteUser = createAsyncThunk(
  'user/removeFavoriteUser',
  async (id:string, {dispatch}) => {
    dispatch(setLoading(true));
    const response = await userService.removeFavoriteUser(id);
    if (response.status === 200) {
      //
    }

    dispatch(setLoading(false));
  });

export const postName =
  (name: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await userService.postName(name);
      dispatch(getMe());
      dispatch(setNameChanged(true));
    } catch (err) {
      const { response }:any = err;
      dispatch(
        setError({
          code: response.data.code,
          message: response.data.message,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const selectIsLoading = (state: RootState) => state.user.loading;
export const selectSuccessNameChanged = (state: RootState) => state.user.nameChanged;
export const selectError = (state: RootState) => state.user.error;
export const selectSuccessAddToFavorite = (state: RootState) => state.user.addToFavorite;
export default userSlice.reducer;
