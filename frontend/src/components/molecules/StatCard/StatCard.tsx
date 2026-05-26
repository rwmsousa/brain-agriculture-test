import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
`;

const Value = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #2e7d32;
  margin: 0;
`;

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <Card>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </Card>
);

export default StatCard;
