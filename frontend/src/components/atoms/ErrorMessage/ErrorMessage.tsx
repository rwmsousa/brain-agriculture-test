import styled from 'styled-components';
import React from 'react';

const StyledError = styled.span`
  display: block;
  color: #c62828;
  font-size: 12px;
  margin-top: 4px;
`;

interface ErrorMessageProps {
  children: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => (
  <StyledError role="alert">{children}</StyledError>
);

export default ErrorMessage;
