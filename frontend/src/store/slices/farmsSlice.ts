import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Farm } from '../../types';
import * as farmsService from '../../services/farms.service';

interface FarmsState {
  items: Farm[];
  selected: Farm | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FarmsState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchFarmsByProducer = createAsyncThunk(
  'farms/fetchByProducer',
  (producerId: string) => farmsService.getFarmsByProducer(producerId),
);

export const fetchFarmById = createAsyncThunk('farms/fetchById', (id: string) =>
  farmsService.getFarmById(id),
);

export const createFarm = createAsyncThunk(
  'farms/create',
  (data: Omit<Farm, 'id' | 'plantedCrops' | 'createdAt' | 'updatedAt'>) =>
    farmsService.createFarm(data),
);

export const updateFarm = createAsyncThunk(
  'farms/update',
  ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Omit<Farm, 'id' | 'producerId' | 'plantedCrops' | 'createdAt' | 'updatedAt'>>;
  }) => farmsService.updateFarm(id, data),
);

export const deleteFarm = createAsyncThunk('farms/delete', async (id: string) => {
  await farmsService.deleteFarm(id);
  return id;
});

const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    clearSelectedFarm: (state) => {
      state.selected = null;
    },
    clearFarms: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmsByProducer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFarmsByProducer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFarmsByProducer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar fazendas';
      });

    builder.addCase(fetchFarmById.fulfilled, (state, action) => {
      state.selected = action.payload;
    });

    builder
      .addCase(createFarm.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createFarm.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao criar fazenda';
      });

    builder.addCase(updateFarm.fulfilled, (state, action) => {
      const index = state.items.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      if (state.selected?.id === action.payload.id) state.selected = action.payload;
    });

    builder.addCase(deleteFarm.fulfilled, (state, action) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
    });
  },
});

export const { clearSelectedFarm, clearFarms } = farmsSlice.actions;
export default farmsSlice.reducer;
