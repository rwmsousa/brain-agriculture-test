import React from 'react';
import styled from 'styled-components';
import { Label } from '../../atoms/Label/Label';
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage';

const FieldWrapper = styled.div`
  margin-bottom: 16px;
`;

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, error, children }) => (
  <FieldWrapper>
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </FieldWrapper>
);

export default FormField;
