import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #2e7d32;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 32px auto;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

export const LoadingSpinner: React.FC = () => (
  <Wrapper>
    <Spinner role="status" aria-label="Carregando..." />
  </Wrapper>
);

export default LoadingSpinner;
