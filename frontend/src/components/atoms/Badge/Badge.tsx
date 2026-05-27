import styled from 'styled-components';
import React from 'react';

const StyledBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #a5d6a7;
`;

interface BadgeProps {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children }) => <StyledBadge>{children}</StyledBadge>;

export default Badge;
