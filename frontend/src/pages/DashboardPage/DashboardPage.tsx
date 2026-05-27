import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectDashboardStatus,
} from '../../store/slices/dashboardSlice';
import { DashboardCharts } from '../../components/organisms/DashboardCharts/DashboardCharts';
import { LoadingSpinner } from '../../components/molecules/LoadingSpinner/LoadingSpinner';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #333;
  margin: 0 0 24px;
`;

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectDashboardStats);
  const status = useAppSelector(selectDashboardStatus);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <PageContainer>
      <PageTitle>Dashboard</PageTitle>
      {status === 'loading' && <LoadingSpinner />}
      {status === 'failed' && <p>Erro ao carregar dados do dashboard.</p>}
      {status === 'succeeded' && stats && <DashboardCharts stats={stats} />}
      {status === 'succeeded' && !stats && <p>Nenhum dado disponivel.</p>}
    </PageContainer>
  );
};

export default DashboardPage;
