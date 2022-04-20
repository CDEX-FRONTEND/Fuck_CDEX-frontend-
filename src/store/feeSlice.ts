import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { feeCalculateProps, feeService } from "../services/api/fee";

type FeeInitialStateType = {
  transactionFee: number;
  serviceFee: number;
  loading: boolean;
};

const initialState: FeeInitialStateType = {
  transactionFee: 0,
  serviceFee: 0,
  loading: false,
};

const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    setFee(state, { payload }) {
      state.transactionFee = payload.transactionFee;
      state.serviceFee = payload.serviceFee;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const getCalculatedFee = createAsyncThunk(
  "fee/crypto/calculate",
  async (props: feeCalculateProps, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      const response = await feeService.getCalculatedFee(props);
      if (response.status === 201) {
        dispatch(setFee(response.data));
      } else if (response.status === 400) {
        // ..
      }
    } catch (err) {
      //const { response } = err;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const { setFee, setLoading } = feeSlice.actions;
export const selectCalculatedFee = (state: RootState) => state.fee;
export default feeSlice.reducer;
