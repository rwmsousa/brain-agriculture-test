import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardStats } from '../../types';
import * as dashboardService from '../../services/dashboard.service';

interface DashboardState {
  stats: DashboardStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = { stats: null, status: 'idle', error: null };

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', () =>
  dashboardService.getDashboardStats(),
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Erro ao carregar dashboard';
      });
  },
});

export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;
export const selectDashboardStatus = (state: { dashboard: DashboardState }) =>
  state.dashboard.status;

export default dashboardSlice.reducer;
