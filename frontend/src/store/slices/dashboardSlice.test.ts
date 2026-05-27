import dashboardReducer, {
  fetchDashboardStats,
  selectDashboardStats,
  selectDashboardStatus,
} from './dashboardSlice';
import { DashboardStats } from '../../types';

jest.mock('../../services/dashboard.service');

const mockStats: DashboardStats = {
  totalFarms: 10,
  totalHectares: 5000.5,
  farmsByState: [
    { state: 'MT', count: 4 },
    { state: 'GO', count: 3 },
  ],
  farmsByCropType: [{ cropType: 'Soja', count: 7 }],
  landUse: { totalArableArea: 3000, totalVegetationArea: 1500 },
};

const initialState = { stats: null, status: 'idle' as const, error: null };

describe('dashboardSlice', () => {
  describe('estado inicial', () => {
    it('tem o estado inicial correto', () => {
      const state = dashboardReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('fetchDashboardStats', () => {
    it('define status como loading no pending', () => {
      const state = dashboardReducer(undefined, fetchDashboardStats.pending('', undefined));
      expect(state.status).toBe('loading');
    });

    it('atualiza stats no fulfilled', () => {
      const state = dashboardReducer(
        undefined,
        fetchDashboardStats.fulfilled(mockStats, '', undefined),
      );
      expect(state.status).toBe('succeeded');
      expect(state.stats).toEqual(mockStats);
    });

    it('define error no rejected', () => {
      const state = dashboardReducer(
        undefined,
        fetchDashboardStats.rejected(new Error('Falha na requisição'), '', undefined),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Falha na requisição');
    });

    it('usa mensagem padrão quando error.message é undefined', () => {
      const action = {
        type: fetchDashboardStats.rejected.type,
        error: { message: undefined },
        meta: { requestId: '', requestStatus: 'rejected', arg: undefined },
        payload: undefined,
      };
      const state = dashboardReducer(undefined, action as any);
      expect(state.error).toBe('Erro ao carregar dashboard');
    });

    it('preserva stats anteriores ao carregar novos dados', () => {
      const stateWithStats = dashboardReducer(
        undefined,
        fetchDashboardStats.fulfilled(mockStats, '', undefined),
      );
      const pendingState = dashboardReducer(
        stateWithStats,
        fetchDashboardStats.pending('', undefined),
      );
      // stats não são apagados no pending
      expect(pendingState.stats).toEqual(mockStats);
      expect(pendingState.status).toBe('loading');
    });
  });

  describe('selectors', () => {
    it('selectDashboardStats retorna as stats do estado', () => {
      const rootState = {
        dashboard: { stats: mockStats, status: 'succeeded' as const, error: null },
      };
      expect(selectDashboardStats(rootState)).toEqual(mockStats);
    });

    it('selectDashboardStats retorna null quando não carregado', () => {
      const rootState = { dashboard: initialState };
      expect(selectDashboardStats(rootState)).toBeNull();
    });

    it('selectDashboardStatus retorna o status atual', () => {
      const rootState = { dashboard: { stats: null, status: 'loading' as const, error: null } };
      expect(selectDashboardStatus(rootState)).toBe('loading');
    });
  });
});
