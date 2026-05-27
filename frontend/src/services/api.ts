import axios from 'axios';

// Construir a URL do backend dinamicamente
const getApiBaseURL = (): string => {
  // Vite dev server local (npm run dev) — backend na porta 3001
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api/v1';
  }

  if (typeof window !== 'undefined' && window.location.hostname) {
    const hostname = window.location.hostname;

    // Docker local ou qualquer ambiente localhost — backend sempre na porta 3001
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001/api/v1';
    }

    // Produção: derivar o domínio do backend a partir do domínio do frontend.
    // Ex.: brain-agriculture-frontend-production.up.railway.app
    //   → brain-agriculture-backend-production.up.railway.app
    const backendDomain = hostname.replace('frontend', 'backend');
    return `https://${backendDomain}/api/v1`;
  }

  // Fallback
  return 'http://localhost:3001/api/v1';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
