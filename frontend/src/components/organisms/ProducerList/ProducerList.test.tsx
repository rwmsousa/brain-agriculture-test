import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import producersReducer from '../../../store/slices/producersSlice';
import { ProducerList } from './ProducerList';
import { Producer } from '../../../types';

jest.mock('../../../services/producers.service');

const createTestStore = () =>
  configureStore({
    reducer: { producers: producersReducer },
  });

const renderList = (producers: Producer[], onEdit?: (p: Producer) => void) => {
  const store = createTestStore();
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <ProducerList producers={producers} onEdit={onEdit} />
      </Provider>
    </MemoryRouter>,
  );
};

const mockProducerCPF: Producer = {
  id: 'p-uuid',
  name: 'João da Silva',
  document: '52998224725',
  documentType: 'CPF',
  farms: [
    {
      id: 'f-uuid',
      producerId: 'p-uuid',
      name: 'Fazenda Verde',
      city: 'Uberlândia',
      state: 'MG',
      totalAreaHectares: 100,
      arableAreaHectares: 60,
      vegetationAreaHectares: 30,
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockProducerCNPJ: Producer = {
  id: 'p-uuid-2',
  name: 'Empresa Agro SA',
  document: '11222333000181',
  documentType: 'CNPJ',
  farms: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('ProducerList', () => {
  describe('Lista vazia', () => {
    it('exibe mensagem quando não há produtores', () => {
      renderList([]);
      expect(screen.getByText('Nenhum produtor cadastrado.')).toBeInTheDocument();
    });
  });

  describe('Renderização da tabela', () => {
    it('exibe cabeçalhos da tabela', () => {
      renderList([mockProducerCPF]);
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Documento')).toBeInTheDocument();
      expect(screen.getByText('Fazendas')).toBeInTheDocument();
      expect(screen.getByText('Acoes')).toBeInTheDocument();
    });

    it('exibe o nome do produtor como link', () => {
      renderList([mockProducerCPF]);
      const link = screen.getByRole('link', { name: 'João da Silva' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/producers/p-uuid');
    });

    it('exibe badge CPF e documento mascarado', () => {
      renderList([mockProducerCPF]);
      expect(screen.getByText('CPF')).toBeInTheDocument();
      expect(screen.getByText(/529\.\*\*\*\.\*\*\*-25/)).toBeInTheDocument();
    });

    it('exibe badge CNPJ e documento mascarado', () => {
      renderList([mockProducerCNPJ]);
      expect(screen.getByText('CNPJ')).toBeInTheDocument();
      expect(screen.getByText(/11\.\*\*\*\.\*\*\*\/\*\*\*\*-81/)).toBeInTheDocument();
    });

    it('exibe o número de fazendas corretamente', () => {
      renderList([mockProducerCPF]);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('exibe 0 fazendas quando o produtor não tem fazendas', () => {
      renderList([mockProducerCNPJ]);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('exibe múltiplos produtores', () => {
      renderList([mockProducerCPF, mockProducerCNPJ]);
      expect(screen.getByText('João da Silva')).toBeInTheDocument();
      expect(screen.getByText('Empresa Agro SA')).toBeInTheDocument();
    });
  });

  describe('Botão Editar', () => {
    it('exibe botão Editar quando onEdit é fornecido', () => {
      const onEdit = jest.fn();
      renderList([mockProducerCPF], onEdit);
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    it('não exibe botão Editar quando onEdit não é fornecido', () => {
      renderList([mockProducerCPF]);
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    });

    it('chama onEdit com o produtor correto ao clicar em Editar', () => {
      const onEdit = jest.fn();
      renderList([mockProducerCPF], onEdit);
      fireEvent.click(screen.getByText('Editar'));
      expect(onEdit).toHaveBeenCalledWith(mockProducerCPF);
    });
  });

  describe('Exclusão de produtor', () => {
    it('exibe botão Excluir para cada produtor', () => {
      renderList([mockProducerCPF]);
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });

    it('abre o diálogo de confirmação ao clicar em Excluir', async () => {
      renderList([mockProducerCPF]);
      fireEvent.click(screen.getByText('Excluir'));

      await waitFor(() => {
        expect(
          screen.getByText(/Tem certeza que deseja excluir este produtor/),
        ).toBeInTheDocument();
      });
    });

    it('fecha o diálogo ao clicar em Cancelar', async () => {
      renderList([mockProducerCPF]);
      fireEvent.click(screen.getByText('Excluir'));

      await waitFor(() => {
        expect(screen.getByText(/Tem certeza/)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancelar'));

      await waitFor(() => {
        expect(screen.queryByText(/Tem certeza/)).not.toBeInTheDocument();
      });
    });
  });
});
