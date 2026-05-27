import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navigation } from './components/organisms/Navigation/Navigation';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { ProducersPage } from './pages/ProducersPage/ProducersPage';
import { ProducerDetailPage } from './pages/ProducerDetailPage/ProducerDetailPage';
import { ConfigPage } from './pages/ConfigPage/ConfigPage';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
    color: #333;
  }
`;

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyle />
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/producers" element={<ProducersPage />} />
          <Route path="/producers/:id" element={<ProducerDetailPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
