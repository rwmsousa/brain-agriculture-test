import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import farmsReducer from '../../../store/slices/farmsSlice';
import producersReducer from '../../../store/slices/producersSlice';
import { FarmForm } from './FarmForm';
import * as farmsService from '../../../services/farms.service';

jest.mock('../../../services/farms.service', () => ({
  createFarm: jest.fn(),
  updateFarm: jest.fn(),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      farms: farmsReducer,
      producers: producersReducer,
    },
  });

const renderForm = (props: Record<string, unknown> = {}) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <FarmForm producerId="producer-uuid" {...props} />
    </Provider>,
  );
};

describe('FarmForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all area fields', () => {
    renderForm();
    expect(screen.getByLabelText('Area Total (ha)')).toBeInTheDocument();
    expect(screen.getByLabelText('Area Agricultavel (ha)')).toBeInTheDocument();
    expect(screen.getByLabelText('Area de Vegetacao (ha)')).toBeInTheDocument();
  });

  it('shows area constraint error when arable + vegetation > total', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Nome da Fazenda'), {
      target: { value: 'Fazenda Teste' },
    });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Cuiaba' } });
    fireEvent.change(screen.getByLabelText('Area Total (ha)'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Area Agricultavel (ha)'), { target: { value: '400' } });
    fireEvent.change(screen.getByLabelText('Area de Vegetacao (ha)'), { target: { value: '200' } });
    fireEvent.click(screen.getByText('Criar Fazenda'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'A soma das areas agricultavel e de vegetacao nao pode exceder a area total',
        ),
      ).toBeInTheDocument();
    });
  });

  it('does not show area constraint error when areas are valid', async () => {
    jest
      .spyOn(farmsService, 'createFarm')
      .mockResolvedValue({ id: 'farm-uuid', name: 'Fazenda Teste' } as never);

    renderForm();

    fireEvent.change(screen.getByLabelText('Nome da Fazenda'), {
      target: { value: 'Fazenda Teste' },
    });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Cuiaba' } });
    fireEvent.change(screen.getByLabelText('Area Total (ha)'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Area Agricultavel (ha)'), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText('Area de Vegetacao (ha)'), { target: { value: '150' } });
    fireEvent.click(screen.getByText('Criar Fazenda'));

    await waitFor(() => {
      expect(
        screen.queryByText(
          'A soma das areas agricultavel e de vegetacao nao pode exceder a area total',
        ),
      ).not.toBeInTheDocument();
    });
  });
});
