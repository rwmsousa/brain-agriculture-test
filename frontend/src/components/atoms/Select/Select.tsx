import styled from 'styled-components';
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

const StyledSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#c62828' : '#ccc')};
  border-radius: 4px;
  font-size: 14px;
  background: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#c62828' : '#2e7d32')};
  }
`;

export const Select: React.FC<SelectProps> = ({ value, onChange, options, error, placeholder }) => (
  <StyledSelect value={value} onChange={onChange} $hasError={!!error}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </StyledSelect>
);

export default Select;
