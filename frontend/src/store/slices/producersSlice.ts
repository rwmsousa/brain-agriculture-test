import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Producer } from '../../types';
import * as producersService from '../../services/producers.service';

interface ProducersState {
  items: Producer[];
  selected: Producer | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProducersState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
};

export const fetchProducers = createAsyncThunk('producers/fetchAll', () =>
  producersService.getProducers(),
);

export const fetchProducerById = createAsyncThunk('producers/fetchById', (id: string) =>
  producersService.getProducerById(id),
);

export const createProducer = createAsyncThunk(
  'producers/create',
  (data: { document: string; documentType: 'CPF' | 'CNPJ'; name: string }) =>
    producersService.createProducer(data),
);

export const updateProducer = createAsyncThunk(
  'producers/update',
  ({
    id,
    data,
  }: {
    id: string;
    data: Partial<{ document: string; documentType: 'CPF' | 'CNPJ'; name: string }>;
  }) => producersService.updateProducer(id, data),
);

export const deleteProducer = createAsyncThunk('producers/delete', async (id: string) => {
  await producersService.deleteProducer(id);
  return id;
});

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducers
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar produtores';
      });

    // fetchProducerById
    builder
      .addCase(fetchProducerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducerById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selected = action.payload;
      })
      .addCase(fetchProducerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar produtor';
      });

    // createProducer
    builder
      .addCase(createProducer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createProducer.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao criar produtor';
      });

    // updateProducer
    builder.addCase(updateProducer.fulfilled, (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      if (state.selected?.id === action.payload.id) state.selected = action.payload;
    });

    // deleteProducer
    builder.addCase(deleteProducer.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
    });
  },
});

export const { clearSelected } = producersSlice.actions;

export const selectAllProducers = (state: { producers: ProducersState }) => state.producers.items;
export const selectSelectedProducer = (state: { producers: ProducersState }) =>
  state.producers.selected;
export const selectProducersStatus = (state: { producers: ProducersState }) =>
  state.producers.status;
export const selectProducersError = (state: { producers: ProducersState }) => state.producers.error;

export default producersSlice.reducer;
