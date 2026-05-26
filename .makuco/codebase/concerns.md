# Cross-Cutting Concerns

## Validation
- CPF/CNPJ format and digit validation (backend)
- Area constraint: arable + vegetation <= total (backend + frontend)
- Required fields enforced via DTOs (class-validator)

## Error Handling
- Global exception filter in NestJS
- Consistent error response format: `{ statusCode, message, error }`
- Frontend displays user-friendly error messages

## Logging
- NestJS Logger for observability
- Log HTTP requests (method, path, status, duration)
- Log business rule violations
- Log database errors

## Security
- Input sanitization
- No authentication required (MVP scope)

## Data Integrity
- Database-level constraints (FK, NOT NULL, CHECK)
- Application-level validation as primary defense
