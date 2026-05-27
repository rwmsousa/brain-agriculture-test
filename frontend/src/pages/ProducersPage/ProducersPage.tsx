import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchProducers,
  selectAllProducers,
  selectProducersStatus,
} from '../../store/slices/producersSlice';
import { ProducerList } from '../../components/organisms/ProducerList/ProducerList';
import { ProducerForm } from '../../components/organisms/ProducerForm/ProducerForm';
import { Button } from '../../components/atoms/Button/Button';
import { LoadingSpinner } from '../../components/molecules/LoadingSpinner/LoadingSpinner';
import { Producer } from '../../types';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 28px 32px;
  border-radius: 8px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ProducersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const producers = useAppSelector(selectAllProducers);
  const status = useAppSelector(selectProducersStatus);
  const [showForm, setShowForm] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchProducers());
  }, [dispatch]);

  const handleEdit = (producer: Producer) => {
    setEditingProducer(producer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProducer(undefined);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Produtores Rurais</PageTitle>
        <Button onClick={() => setShowForm(true)}>Novo Produtor</Button>
      </PageHeader>

      {status === 'loading' && <LoadingSpinner />}
      {status === 'failed' && <p>Erro ao carregar produtores.</p>}
      {status !== 'loading' && <ProducerList producers={producers} onEdit={handleEdit} />}

      {showForm && (
        <Modal>
          <ModalContent>
            <h2 style={{ margin: '0 0 16px' }}>
              {editingProducer ? 'Editar Produtor' : 'Novo Produtor'}
            </h2>
            <ProducerForm
              producer={editingProducer}
              onSuccess={() => {
                handleCloseForm();
                dispatch(fetchProducers());
              }}
              onCancel={handleCloseForm}
            />
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ProducersPage;
