import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: #2e7d32;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 56px;
  gap: 24px;
`;

const Brand = styled.span`
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-right: 24px;
`;

const StyledNavLink = styled(NavLink)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  padding: 4px 0;

  &.active {
    color: white;
    border-bottom: 2px solid white;
  }

  &:hover {
    color: white;
  }
`;

export const Navigation: React.FC = () => (
  <Nav>
    <Brand>Brain Agriculture</Brand>
    <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
    <StyledNavLink to="/producers">Produtores</StyledNavLink>
  </Nav>
);

export default Navigation;
