# Integrations

## Internal
- Frontend → Backend: REST API over HTTP
- Backend → PostgreSQL: TypeORM connection

## External
- None required for MVP

## Docker Networking
- All containers on same Docker network
- Frontend calls backend via service name (`http://backend:3001`)
- Backend connects to DB via service name (`postgres://database:5432`)

## API Documentation
- Swagger UI exposed at `/api/docs`
- OpenAPI JSON at `/api/docs-json`
