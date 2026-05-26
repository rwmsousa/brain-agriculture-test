import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CropType } from '../../types';
import * as cropTypesService from '../../services/cropTypes.service';

interface CropTypesState {
  items: CropType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CropTypesState = { items: [], status: 'idle', error: null };

export const fetchCropTypes = createAsyncThunk('cropTypes/fetchAll', () =>
  cropTypesService.getCropTypes(),
);

const cropTypesSlice = createSlice({
  name: 'cropTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCropTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCropTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCropTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar tipos de cultura';
      });
  },
});

export default cropTypesSlice.reducer;
