# Testing Strategy

## Backend
- **Unit Tests**: Services and business logic (Jest)
- **Integration Tests**: Controller + Service + Repository against real DB or test DB
- **Mock Data**: Factories/fixtures for all entities
- **Coverage**: Target 80%+ on services

## Frontend
- **Unit Tests**: Components (React Testing Library + Jest)
- **Mock Data**: MSW (Mock Service Worker) or manual mocks for API calls
- **Coverage**: Target 70%+ on components and store

## Test File Conventions
- Backend: `*.spec.ts` next to source files
- Frontend: `*.test.tsx` or `*.spec.tsx` next to components
