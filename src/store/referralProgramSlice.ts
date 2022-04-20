import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '.';
import { referralProgramService } from '../services/api/referal-program';

export type ReferralProgramLinkType = {
  userId: string;
  type: string;
  code: string;
  createdAt: string;
}

export type ReferralProgramRewardListMyType = {
  id: string;
  currencyId: string;
  reward: number;
  created_at: string;
}

export type ReferralProgramInvitedListMyType = {
  id: string;
  name: string;
  created_at: string;
}

export type ReferralProgramSliceInitialState = {
  loading: boolean;
  referralProgramLink: ReferralProgramLinkType | null;
  referralProgramRewardListMy: ReferralProgramRewardListMyType[];
  referralProgramInvitedListMy: ReferralProgramInvitedListMyType[];
};

export type ParamsForListType = {
  page:number;
  take:number;
}


const initialState: ReferralProgramSliceInitialState = {
  loading: false,
  referralProgramLink: null,
  referralProgramRewardListMy: [],
  referralProgramInvitedListMy: []
};


const referralProgramSlice = createSlice({
  name: 'referralProgram',
  initialState,
  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setReferralProgramLink(state, { payload }) {
      state.referralProgramLink = payload;
    },
    setReferralProgramRewardListMy(state, { payload }) {
      state.referralProgramRewardListMy = payload;
    },
    setReferralProgramInvitedListMy(state, { payload }) {
      state.referralProgramInvitedListMy = payload;
    },
  }
});


export const { setLoading, setReferralProgramLink, setReferralProgramRewardListMy,
  setReferralProgramInvitedListMy } = referralProgramSlice.actions;


export const getReferalProgramLink = (type:string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await referralProgramService.getReferalProgramLink (type);
    if (response.status === 200) {
      dispatch(setReferralProgramLink(response.data));
    }
  }
  catch (err) {
  }
  finally {
    dispatch(setLoading(false));
  }

}

export const getReferalProgramRewardListMy = (params: ParamsForListType): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await referralProgramService.getReferalProgramRewardListMy (params);
    if (response.status === 200) {
      dispatch(setReferralProgramLink(response.data));
    }
  }
  catch (err) {
  }
  finally {
    dispatch(setLoading(false));
  }
}

export const getReferalProgramInvitedListMy = (params: ParamsForListType): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await referralProgramService.getReferalProgramInvitedListMy (params);
    if (response.status === 200) {
      dispatch(setReferralProgramInvitedListMy(response.data.data));
    }
  }
  catch (err) {
  }
  finally {
    dispatch(setLoading(false));
  }
}
export const loading = (state: RootState) => state.referralProgram.loading;
export const selectReferalProgramLink = (state: RootState) => state.referralProgram.referralProgramLink;
export const selectReferalProgramRewardListMy = (state: RootState) => state.referralProgram.referralProgramRewardListMy;
export const selectReferalProgramInvitedListMy = (state: RootState) => state.referralProgram.referralProgramInvitedListMy;

export default referralProgramSlice.reducer;