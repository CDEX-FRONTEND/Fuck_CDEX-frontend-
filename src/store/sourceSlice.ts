import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { sourceService } from '../services/api/source';

type SourcesItemType = {
  marketId: string;
  bid: string;
  ask: string;
  price: string;
};

type SourcesType = {
  binance: SourcesItemType[];
  moex: SourcesItemType[];
};

type SourceSliceInitialStateType = {
  externalSources: SourcesType | null;
  loading: boolean;
};

const initialState: SourceSliceInitialStateType = {
  externalSources: null,
  loading: false,
};

const sourceSlice = createSlice({
  name: 'source',
  initialState,
  reducers: {
    setExternalSources(state, { payload }) {
      state.externalSources = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setExternalSources, setLoading } = sourceSlice.actions;

export const getExternalSources = createAsyncThunk(
  'source/getExternalSources',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));

    const response = await sourceService.getExternalSources();
    if (response.status === 200) {
      dispatch(setExternalSources(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const selectExternalSources = (state: RootState) =>
  state.source.externalSources;

export default sourceSlice.reducer;
