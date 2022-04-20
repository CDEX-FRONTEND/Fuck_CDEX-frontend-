import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import walletReducer from './walletSlice';
import orderReducer from './orderSlice';
import marketReducer from './marketSlice';
import tradeReducer from './tradeSlice';
import otcReducer from './otcSlice';
import chatReducer from './chatSlice';
import sourceReducer from './sourceSlice';
import adminReducer from './adminSlice';
import feeReducer from './feeSlice';
import notificationsReducer from './notificationsSlice';
import referralProgramReducer from './referralProgramSlice';
import complaintReducer from './complaintSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    wallet: walletReducer,
    order: orderReducer,
    market: marketReducer,
    trade: tradeReducer,
    otc: otcReducer,
    chat: chatReducer,
    source: sourceReducer,
    admin: adminReducer,
    fee: feeReducer,
    notifications: notificationsReducer,
    referralProgram: referralProgramReducer,
    complaint: complaintReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
