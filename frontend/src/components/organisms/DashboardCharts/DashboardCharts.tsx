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

  const outrasAreas = Math.max(
    0,
    stats.totalHectares - stats.landUse.totalArableArea - stats.landUse.totalVegetationArea,
  );

  const COLORS_LAND = ['#2e7d32', '#66bb6a', '#c8e6c9'];

  const landUseData = [
    { name: 'Agricultável', value: stats.landUse.totalArableArea },
    { name: 'Vegetação', value: stats.landUse.totalVegetationArea },
    ...(outrasAreas > 0 ? [{ name: 'Outras Áreas', value: outrasAreas }] : []),
  ];

  const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

  return (
    <div>
      {/* Linha 1: totais gerais */}
      <Grid>
        <StatCard title="Total de Fazendas" value={stats.totalFarms} />
        <StatCard title="Total de Hectares (ha)" value={fmt(stats.totalHectares)} />
      </Grid>

      {/* Linha 2: detalhamento do uso do solo (deve somar ao Total de Hectares) */}
      <Grid style={{ marginBottom: 32 }}>
        <StatCard title="Área Agricultável (ha)" value={fmt(stats.landUse.totalArableArea)} />
        <StatCard title="Área de Vegetação (ha)" value={fmt(stats.landUse.totalVegetationArea)} />
        {outrasAreas > 0 && <StatCard title="Outras Áreas (ha)" value={fmt(outrasAreas)} />}
      </Grid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Fazendas por Estado</ChartTitle>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <Pie
                data={stateData}
                cx="50%"
                cy="48%"
                outerRadius={75}
                dataKey="value"
                nameKey="name"
                label={({ value }) => value}
                labelLine={true}
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
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <Pie
                data={cropTypeData}
                cx="50%"
                cy="48%"
                outerRadius={75}
                dataKey="value"
                nameKey="name"
                label={({ value }) => value}
                labelLine={true}
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
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <Pie
                data={landUseData}
                cx="50%"
                cy="48%"
                outerRadius={75}
                dataKey="value"
                nameKey="name"
                label={({ value }) => value.toLocaleString('pt-BR')}
                labelLine={true}
              >
                {landUseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_LAND[index % COLORS_LAND.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR')} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </div>
  );
};

export default DashboardCharts;
