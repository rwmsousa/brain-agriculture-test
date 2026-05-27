import styled from 'styled-components';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#c62828' : '#ccc')};
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#c62828' : '#2e7d32')};
  }
`;

export const Input: React.FC<InputProps> = ({ error, ...props }) => (
  <StyledInput $hasError={!!error} {...props} />
);

export default Input;
