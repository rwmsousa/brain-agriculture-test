import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '../../../types';
import { StatCard } from '../../molecules/StatCard/StatCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  color: #444;
  margin: 0 0 16px;
`;

const COLORS = ['#2e7d32', '#43a047', '#66bb6a', '#a5d6a7', '#c8e6c9', '#1b5e20', '#388e3c'];

interface DashboardChartsProps {
  stats: DashboardStats;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const stateData = stats.farmsByState.map((item) => ({
    name: item.state,
    value: item.count,
  }));

  const cropTypeData = stats.farmsByCropType.map((item) => ({
    name: item.cropType,
    value: item.count,
  }));

  const landUseData = [
    { name: 'Agricultavel', value: stats.landUse.totalArableArea },
    { name: 'Vegetacao', value: stats.landUse.totalVegetationArea },
  ];

  return (
    <div>
      <Grid>
        <StatCard title="Total de Fazendas" value={stats.totalFarms} />
        <StatCard
          title="Total de Hectares"
          value={stats.totalHectares.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
        />
        <StatCard
          title="Area Agricultavel (ha)"
          value={stats.landUse.totalArableArea.toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })}
        />
        <StatCard
          title="Area de Vegetacao (ha)"
          value={stats.landUse.totalVegetationArea.toLocaleString('pt-BR', {
            maximumFractionDigits: 2,
          })}
        />
      </Grid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Fazendas por Estado</ChartTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label
              >
                {stateData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Fazendas por Tipo de Cultura</ChartTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cropTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label
              >
                {cropTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Uso do Solo</ChartTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={landUseData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label
              >
                {landUseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </div>
  );
};

export default DashboardCharts;
