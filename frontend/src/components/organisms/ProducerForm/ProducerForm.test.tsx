import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import producersReducer from '../../../store/slices/producersSlice';
import { ProducerForm } from './ProducerForm';

// Mock the service
jest.mock('../../../services/producers.service', () => ({
  createProducer: jest.fn(),
  updateProducer: jest.fn(),
}));

import * as producersService from '../../../services/producers.service';

const createTestStore = () => configureStore({ reducer: { producers: producersReducer } });

const renderForm = (props = {}) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ProducerForm {...props} />
    </Provider>,
  );
};

describe('ProducerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Documento')).toBeInTheDocument();
    expect(screen.getByText('Criar Produtor')).toBeInTheDocument();
  });

  it('shows inline error for invalid CPF', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Documento'), {
      target: { value: '111.111.111-11' },
    });
    fireEvent.click(screen.getByText('Criar Produtor'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('CPF invalido')).toBeInTheDocument();
    });
  });

  it('does NOT dispatch when document is invalid', async () => {
    const mockCreate = jest.spyOn(producersService, 'createProducer');
    renderForm();

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Documento'), { target: { value: '000.000.000-00' } });
    fireEvent.click(screen.getByText('Criar Produtor'));

    await waitFor(() => {
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  it('clears CPF error when valid CPF is typed', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Documento'), {
      target: { value: '111.111.111-11' },
    });
    fireEvent.click(screen.getByText('Criar Produtor'));

    await waitFor(() => {
      expect(screen.getByText('CPF invalido')).toBeInTheDocument();
    });

    // Type valid CPF
    fireEvent.change(screen.getByLabelText('Documento'), {
      target: { value: '529.982.247-25' },
    });
    fireEvent.click(screen.getByText('Criar Produtor'));

    await waitFor(() => {
      expect(screen.queryByText('CPF invalido')).not.toBeInTheDocument();
    });
  });

  it('dispatches createProducer with valid data', async () => {
    const mockCreate = jest.spyOn(producersService, 'createProducer').mockResolvedValue({
      id: 'new-uuid',
      document: '52998224725',
      documentType: 'CPF',
      name: 'João',
      createdAt: '',
      updatedAt: '',
    });

    const onSuccess = jest.fn();
    renderForm({ onSuccess });

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText('Documento'), {
      target: { value: '529.982.247-25' },
    });
    fireEvent.click(screen.getByText('Criar Produtor'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ document: '529.982.247-25', documentType: 'CPF', name: 'João' }),
      );
    });
  });
});
