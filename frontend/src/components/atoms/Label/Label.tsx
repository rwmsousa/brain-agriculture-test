import styled from 'styled-components';
import React from 'react';

const StyledLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #444;
  margin-bottom: 4px;
`;

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ htmlFor, children }) => (
  <StyledLabel htmlFor={htmlFor}>{children}</StyledLabel>
);

export default Label;
