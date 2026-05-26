import producersReducer, {
  fetchProducers,
  createProducer,
  deleteProducer,
  clearSelected,
} from './producersSlice';
import { Producer } from '../../types';

// Mock the service module
jest.mock('../../services/producers.service');

const mockProducer: Producer = {
  id: 'test-uuid',
  document: '52998224725',
  documentType: 'CPF',
  name: 'João da Silva',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  farms: [],
};

describe('producersSlice', () => {
  describe('initial state', () => {
    it('has the correct initial state', () => {
      const state = producersReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual({
        items: [],
        selected: null,
        status: 'idle',
        error: null,
      });
    });
  });

  describe('fetchProducers', () => {
    it('sets status to loading on pending', () => {
      const state = producersReducer(undefined, fetchProducers.pending('', undefined));
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('updates items on fulfilled', () => {
      const state = producersReducer(
        undefined,
        fetchProducers.fulfilled([mockProducer], '', undefined),
      );
      expect(state.status).toBe('succeeded');
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProducer);
    });

    it('sets error on rejected', () => {
      const state = producersReducer(
        undefined,
        fetchProducers.rejected(new Error('Network error'), '', undefined),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error');
    });
  });

  describe('createProducer', () => {
    it('adds producer to items on fulfilled', () => {
      const state = producersReducer(
        { items: [], selected: null, status: 'idle', error: null },
        createProducer.fulfilled(mockProducer, '', {
          document: '52998224725',
          documentType: 'CPF',
          name: 'João da Silva',
        }),
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProducer);
    });
  });

  describe('deleteProducer', () => {
    it('removes producer from items on fulfilled', () => {
      const initialState = {
        items: [mockProducer],
        selected: null,
        status: 'succeeded' as const,
        error: null,
      };
      const state = producersReducer(
        initialState,
        deleteProducer.fulfilled('test-uuid', '', 'test-uuid'),
      );
      expect(state.items).toHaveLength(0);
    });

    it('clears selected when deleted producer was selected', () => {
      const initialState = {
        items: [mockProducer],
        selected: mockProducer,
        status: 'succeeded' as const,
        error: null,
      };
      const state = producersReducer(
        initialState,
        deleteProducer.fulfilled('test-uuid', '', 'test-uuid'),
      );
      expect(state.selected).toBeNull();
    });
  });

  describe('clearSelected', () => {
    it('sets selected to null', () => {
      const initialState = {
        items: [],
        selected: mockProducer,
        status: 'succeeded' as const,
        error: null,
      };
      const state = producersReducer(initialState, clearSelected());
      expect(state.selected).toBeNull();
    });
  });
});
