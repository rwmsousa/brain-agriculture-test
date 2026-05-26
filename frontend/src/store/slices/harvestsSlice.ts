import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Harvest } from '../../types';
import * as harvestsService from '../../services/harvests.service';

interface HarvestsState {
  items: Harvest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HarvestsState = { items: [], status: 'idle', error: null };

export const fetchHarvests = createAsyncThunk('harvests/fetchAll', () =>
  harvestsService.getHarvests(),
);

export const createHarvest = createAsyncThunk('harvests/create', (data: { name: string }) =>
  harvestsService.createHarvest(data),
);

const harvestsSlice = createSlice({
  name: 'harvests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHarvests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHarvests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchHarvests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar safras';
      });
    builder.addCase(createHarvest.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
  },
});

export default harvestsSlice.reducer;
