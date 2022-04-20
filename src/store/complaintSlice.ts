import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '.';
import { complaintService } from '../services/api/complaint';

export type Complaint = {
  complainUserId: string;
  complainReasonId: string;
  description: string;
  outId: string;
  module: string;
};

export type ComplaintReason = {
  id: string;
  name: string;
};

export type ComplaintInfo = {
  id: string;
  userId: string;
  userName: string;
  complaintUserId: string;
  complaintUserName: string;
  complaintReasonId: string;
  complaintReasonName: string;
  description: string;
  outId: string;
  module: string;
  createdAt: string;
  isRead: boolean;
};

export type ComplaintsParams = {
  page: number;
  take: number;
  reasonId: string;
};

export type ComplaintsListType = {
  data: ComplaintInfo[];
  page: number;
  take: number;
  total: number;
};

type complaintScliceInitialState = {
  complaint: Complaint | null;
  loading: boolean;
  reasons: ComplaintReason[];
  complaintField: boolean;
  ComplaintsListType: ComplaintsListType | null;
  complaints: ComplaintInfo[];
  complaintInfo: ComplaintInfo | null;
};

const initialState: complaintScliceInitialState = {
  complaint: null,
  loading: false,
  complaintField: false,
  reasons: [],
  complaints: [],
  ComplaintsListType: null,
  complaintInfo: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setReasons(state, { payload }) {
      state.reasons = payload;
    },
    setComplaint(state, { payload }) {
      state.complaint = payload;
    },
    setComplaintField: (state, { payload }) => {
      state.complaintField = payload;
    },
    setComplaints(state, { payload }) {
      state.complaints = payload;
    },
    setComplaintsList(state, { payload }) {
      state.ComplaintsListType = payload;
    },
    setComplaintInfo(state, {payload}) {
      state.complaintInfo = payload;
    }
  },
});

export const {
  setLoading,
  setReasons,
  setComplaintField,
  setComplaints,
  setComplaintsList,
  setComplaintInfo,
} = complaintSlice.actions;

export const selectLoading = (state: RootState) => state.complaint.loading;

export const getReasons = createAsyncThunk(
  'complaint/getReason',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await complaintService.getReason();
    if (response.status === 200) {
      dispatch(setReasons(response.data));
      dispatch(setComplaintField(false));
    }
    dispatch(setLoading(false));
  }
);

export const fileComplaint =
  (params: any): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await complaintService.addComplaint(params);
      dispatch(setComplaintField(true));
    } catch (err) {
        // ignore
    } finally {
      dispatch(setLoading(false));
      dispatch(setComplaintField(false));
    }
  };

export const getComplaints = createAsyncThunk(
  'complaint/getComplaints',
  async (params: ComplaintsParams, { dispatch }) => {
    dispatch(setLoading(true));
    const response = await complaintService.getComplaintsList(params);
    if (response.status === 200) {
      dispatch(setComplaints(response.data.data));
    }
    dispatch(setLoading(false));
  }
);

export const getComplaint = createAsyncThunk(
  'complaint/getComlaint',
  async (id: string, {dispatch}) => {
    dispatch(setLoading(true));
    const response = await complaintService.getComplaint(id);
    if (response.status === 200) {
      dispatch(setComplaintInfo(response.data))
    }

    dispatch(setLoading(false));
  }
)

export const selectReasons = (state: RootState) => state.complaint.reasons;
export const selectSuccessComplaintField = (state: RootState) =>
  state.complaint.complaintField;
export const selectComplaints = (state: RootState) =>
  state.complaint.complaints;

export default complaintSlice.reducer;
