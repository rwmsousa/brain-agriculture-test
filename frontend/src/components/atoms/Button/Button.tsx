import styled from 'styled-components';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return 'background-color: #2e7d32; color: white;';
      case 'secondary':
        return 'background-color: #e0e0e0; color: #333;';
      case 'danger':
        return 'background-color: #c62828; color: white;';
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => (
  <StyledButton $variant={variant} {...props}>
    {children}
  </StyledButton>
);

export default Button;
