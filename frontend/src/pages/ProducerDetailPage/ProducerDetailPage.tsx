import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchProducerById,
  selectSelectedProducer,
  selectProducersStatus,
} from '../../store/slices/producersSlice';
import { ProducerDetail } from '../../components/organisms/ProducerDetail/ProducerDetail';
import { LoadingSpinner } from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  color: #2e7d32;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProducerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const producer = useAppSelector(selectSelectedProducer);
  const status = useAppSelector(selectProducersStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchProducerById(id));
    }
  }, [dispatch, id]);

  return (
    <PageContainer>
      <BackLink to="/producers">← Voltar aos Produtores</BackLink>
      {/* Spinner apenas na carga inicial (producer ainda não existe).
          Durante refreshes mantém o ProducerDetail montado para preservar
          o estado local (fazenda aberta, seleções, etc.). */}
      {status === 'loading' && !producer && <LoadingSpinner />}
      {status === 'failed' && !producer && <p>Produtor não encontrado.</p>}
      {producer && <ProducerDetail producer={producer} />}
    </PageContainer>
  );
};

export default ProducerDetailPage;
