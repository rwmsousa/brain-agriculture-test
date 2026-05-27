import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import producersReducer from '../../../store/slices/producersSlice';
import farmsReducer from '../../../store/slices/farmsSlice';
import harvestsReducer from '../../../store/slices/harvestsSlice';
import cropTypesReducer from '../../../store/slices/cropTypesSlice';
import plantedCropsReducer from '../../../store/slices/plantedCropsSlice';
import { ProducerForm } from './ProducerForm';

// ── Mocks de serviços ──────────────────────────────────────────────────────────

jest.mock('../../../services/producers.service', () => ({
  createProducer: jest.fn(),
  updateProducer: jest.fn(),
  getProducers: jest.fn(),
}));

jest.mock('../../../services/farms.service', () => ({
  createFarm: jest.fn(),
  updateFarm: jest.fn(),
}));

jest.mock('../../../services/plantedCrops.service', () => ({
  addPlantedCrop: jest.fn(),
  removePlantedCrop: jest.fn(),
  getPlantedCropsByFarm: jest.fn(),
}));

jest.mock('../../../services/harvests.service', () => ({
  getHarvests: jest.fn().mockResolvedValue([
    { id: 'h1', name: 'Safra 2023' },
    { id: 'h2', name: 'Safra 2024' },
  ]),
}));

jest.mock('../../../services/cropTypes.service', () => ({
  getCropTypes: jest.fn().mockResolvedValue([
    { id: 'ct1', name: 'Soja' },
    { id: 'ct2', name: 'Milho' },
  ]),
}));

import * as producersService from '../../../services/producers.service';
import * as farmsService from '../../../services/farms.service';

// ── Helpers ────────────────────────────────────────────────────────────────────

const createTestStore = () =>
  configureStore({
    reducer: {
      producers: producersReducer,
      farms: farmsReducer,
      harvests: harvestsReducer,
      cropTypes: cropTypesReducer,
      plantedCrops: plantedCropsReducer,
    },
  });

const renderForm = (props = {}) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ProducerForm {...props} />
    </Provider>,
  );
};

/** Preenche os campos obrigatórios do formulário (produtor + fazenda). */
const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText('Nome do Produtor'), { target: { value: 'João Silva' } });
  fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '529.982.247-25' } });
  fireEvent.change(screen.getByLabelText('Nome da Fazenda'), {
    target: { value: 'Fazenda Verde' },
  });
  fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Uberlândia' } });
  // Estado: selecionamos via select (primeiro option real)
  const stateSelect = screen.getByLabelText('Estado');
  fireEvent.change(stateSelect, { target: { value: 'MG' } });
  fireEvent.change(screen.getByLabelText('Área Total (ha)'), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText('Área Agricultável (ha)'), { target: { value: '60' } });
  fireEvent.change(screen.getByLabelText('Área de Vegetação (ha)'), { target: { value: '30' } });
};

// ── Testes ─────────────────────────────────────────────────────────────────────

describe('ProducerForm — novo formulário unificado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('exibe todos os campos obrigatórios do produtor', () => {
      renderForm();
      expect(screen.getByLabelText('Nome do Produtor')).toBeInTheDocument();
      expect(screen.getByLabelText('CPF')).toBeInTheDocument();
      expect(screen.getByText('Tipo de Documento')).toBeInTheDocument();
    });

    it('exibe todos os campos obrigatórios da fazenda', () => {
      renderForm();
      expect(screen.getByLabelText('Nome da Fazenda')).toBeInTheDocument();
      expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
      expect(screen.getByLabelText('Estado')).toBeInTheDocument();
      expect(screen.getByLabelText('Área Total (ha)')).toBeInTheDocument();
      expect(screen.getByLabelText('Área Agricultável (ha)')).toBeInTheDocument();
      expect(screen.getByLabelText('Área de Vegetação (ha)')).toBeInTheDocument();
    });

    it('exibe seção de culturas plantadas com botão de adicionar', () => {
      renderForm();
      expect(screen.getByText('Culturas Plantadas')).toBeInTheDocument();
      expect(screen.getByText('+ Adicionar Cultura')).toBeInTheDocument();
    });

    it('exibe botão "Cadastrar Produtor" para novo produtor', () => {
      renderForm();
      expect(screen.getByText('Cadastrar Produtor')).toBeInTheDocument();
    });

    it('exibe botão "Salvar Alterações" no modo edição', () => {
      const producer = {
        id: 'p1',
        name: 'Maria',
        document: '52998224725',
        documentType: 'CPF' as const,
        farms: [],
        createdAt: '',
        updatedAt: '',
      };
      renderForm({ producer });
      expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
    });

    it('altera placeholder do documento ao trocar tipo para CNPJ', () => {
      renderForm();
      const typeSelect = screen.getByDisplayValue('CPF');
      fireEvent.change(typeSelect, { target: { value: 'CNPJ' } });
      expect(screen.getByLabelText('CNPJ')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeInTheDocument();
    });
  });

  describe('Validações do produtor', () => {
    it('exibe erro quando nome está vazio', async () => {
      renderForm();
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        expect(screen.getByText('Nome obrigatório')).toBeInTheDocument();
      });
    });

    it('exibe erro de CPF inválido', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Nome do Produtor'), { target: { value: 'Teste' } });
      fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '111.111.111-11' } });
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        expect(screen.getByText('CPF inválido')).toBeInTheDocument();
      });
    });

    it('não dispara submissão com CPF inválido', async () => {
      const mockCreate = jest.spyOn(producersService, 'createProducer');
      renderForm();

      fireEvent.change(screen.getByLabelText('Nome do Produtor'), { target: { value: 'Teste' } });
      fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '000.000.000-00' } });
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        expect(mockCreate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Validações da fazenda', () => {
    it('exibe erros quando campos da fazenda estão vazios', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Nome do Produtor'), { target: { value: 'João' } });
      fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '529.982.247-25' } });
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        expect(screen.getByText('Nome da fazenda obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Cidade obrigatória')).toBeInTheDocument();
        expect(screen.getByText('Estado obrigatório')).toBeInTheDocument();
      });
    });

    it('exibe erro quando soma das áreas excede área total', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Nome do Produtor'), { target: { value: 'João' } });
      fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '529.982.247-25' } });
      fireEvent.change(screen.getByLabelText('Nome da Fazenda'), { target: { value: 'Fazenda' } });
      fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'SP' } });
      fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'SP' } });
      fireEvent.change(screen.getByLabelText('Área Total (ha)'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Área Agricultável (ha)'), {
        target: { value: '80' },
      });
      fireEvent.change(screen.getByLabelText('Área de Vegetação (ha)'), {
        target: { value: '40' },
      });
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        expect(
          screen.getByText(
            'A soma das áreas agricultável e de vegetação não pode exceder a área total',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Culturas plantadas', () => {
    it('adiciona nova linha de cultura ao clicar no botão', async () => {
      renderForm();
      fireEvent.click(screen.getByText('+ Adicionar Cultura'));
      await waitFor(() => {
        expect(screen.getAllByText(/Selecione a safra/i).length).toBeGreaterThan(0);
      });
    });

    it('remove linha de cultura ao clicar no botão ×', async () => {
      renderForm();
      fireEvent.click(screen.getByText('+ Adicionar Cultura'));

      await waitFor(() => {
        expect(screen.getAllByText(/Selecione a safra/i).length).toBeGreaterThan(0);
      });

      const removeBtn = screen.getByTitle('Remover cultura');
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.queryByTitle('Remover cultura')).not.toBeInTheDocument();
      });
    });

    it('exibe erro quando linha de cultura está incompleta ao submeter', async () => {
      renderForm();
      fireEvent.click(screen.getByText('+ Adicionar Cultura'));
      fillRequiredFields();
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        // O erro de validação é renderizado em um <span role="alert">
        const alerts = screen.getAllByRole('alert');
        const alertTexts = alerts.map((a) => a.textContent);
        expect(alertTexts).toContain('Selecione a safra');
        expect(alertTexts).toContain('Selecione a cultura');
      });
    });
  });

  describe('Submissão com dados válidos', () => {
    it('chama createProducer e createFarm ao submeter com dados válidos', async () => {
      const mockProducer = {
        id: 'p-new',
        document: '52998224725',
        documentType: 'CPF' as const,
        name: 'João Silva',
        createdAt: '',
        updatedAt: '',
      };
      const mockFarm = {
        id: 'f-new',
        producerId: 'p-new',
        name: 'Fazenda Verde',
        city: 'Uberlândia',
        state: 'MG',
        totalAreaHectares: 100,
        arableAreaHectares: 60,
        vegetationAreaHectares: 30,
      };

      jest.spyOn(producersService, 'createProducer').mockResolvedValue(mockProducer);
      jest.spyOn(farmsService, 'createFarm').mockResolvedValue(mockFarm);

      const onSuccess = jest.fn();
      renderForm({ onSuccess });
      fillRequiredFields();
      fireEvent.click(screen.getByText('Cadastrar Produtor'));

      await waitFor(() => {
        expect(producersService.createProducer).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'João Silva',
            document: '529.982.247-25',
            documentType: 'CPF',
          }),
        );
        expect(farmsService.createFarm).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Fazenda Verde',
            city: 'Uberlândia',
            state: 'MG',
            totalAreaHectares: 100,
            arableAreaHectares: 60,
            vegetationAreaHectares: 30,
            producerId: 'p-new',
          }),
        );
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });
});
