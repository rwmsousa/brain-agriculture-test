import axios from 'axios';

// Construir a URL do backend dinamicamente
const getApiBaseURL = (): string => {
  // Em desenvolvimento, usar localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8080/api/v1';
  }

  // Em produção, derivar do domínio público do frontend
  // Se o frontend está em brain-agriculture-frontend-production.up.railway.app,
  // o backend está em brain-agriculture-backend-production.up.railway.app
  if (typeof window !== 'undefined' && window.location.hostname) {
    const backendDomain = window.location.hostname.replace('frontend', 'backend');
    return `https://${backendDomain}/api/v1`;
  }

  // Fallback
  return 'http://localhost:8080/api/v1';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
