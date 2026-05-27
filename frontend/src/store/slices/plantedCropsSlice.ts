import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlantedCrop } from '../../types';
import * as plantedCropsService from '../../services/plantedCrops.service';

interface PlantedCropsState {
  items: PlantedCrop[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlantedCropsState = { items: [], status: 'idle', error: null };

export const fetchPlantedCropsByFarm = createAsyncThunk(
  'plantedCrops/fetchByFarm',
  (farmId: string) => plantedCropsService.getPlantedCropsByFarm(farmId),
);

export const addPlantedCrop = createAsyncThunk(
  'plantedCrops/add',
  (data: { farmId: string; harvestId: string; cropTypeId: string }) =>
    plantedCropsService.addPlantedCrop(data),
);

export const removePlantedCrop = createAsyncThunk('plantedCrops/remove', async (id: string) => {
  await plantedCropsService.removePlantedCrop(id);
  return id;
});

const plantedCropsSlice = createSlice({
  name: 'plantedCrops',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlantedCropsByFarm.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(addPlantedCrop.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(removePlantedCrop.fulfilled, (state, action) => {
      state.items = state.items.filter((pc) => pc.id !== action.payload);
    });
  },
});

export default plantedCropsSlice.reducer;
