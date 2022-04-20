import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '.';
import { IError } from './authSlice';
import { notificationsService } from '../services/api/notifications';

export type NotificationSettingType = {
  userId: string;
  eventType: string;
  email: boolean;
  telegram: boolean;
};

type NotificationsSliceInitialState = {
  settings: NotificationSettingType[] | null;
  loading: boolean;
  error?: IError | null;
};

const initialState: NotificationsSliceInitialState = {
  settings: null,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSettings: (state, { payload }) => {
      state.settings = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
  },
});

export const { setSettings, setLoading, setError } = notificationsSlice.actions;

export const getNotificationsSettings = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await notificationsService.getSettings();
    if (response.status === 200) {
      dispatch(setSettings(response.data));
    }
  } catch (error) {
    //
  } finally {
    dispatch(setLoading(false));
  }
};

export const enableNotificationSetting =
  (eventType: string, eventKey: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await notificationsService.enableSetting(eventType, eventKey);
      dispatch(getNotificationsSettings());
    } catch (err) {
      const { response } = err;
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

export const disableNotificationSetting =
  (eventType: string, eventKey: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await notificationsService.disableSetting(eventType, eventKey);
      dispatch(getNotificationsSettings());
    } catch (err) {
      const { response } = err;
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

export const selectSettings = (state: RootState) =>
  state.notifications.settings;
export const selectIsLoading = (state: RootState) =>
  state.notifications.loading;
export const selectError = (state: RootState) => state.notifications.error;

export default notificationsSlice.reducer;
