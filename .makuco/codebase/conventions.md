# Conventions

## Naming
- Files: kebab-case (e.g., `producer.entity.ts`, `create-producer.dto.ts`)
- Classes: PascalCase
- Functions/methods: camelCase
- Constants: UPPER_SNAKE_CASE
- Database tables: snake_case (e.g., `rural_producers`, `planted_crops`)

## Backend
- REST endpoints: plural nouns, kebab-case (e.g., `/api/v1/rural-producers`)
- DTOs: CreateXxxDto, UpdateXxxDto, ResponseXxxDto
- Entities match database table structure

## Frontend
- Components: PascalCase files and folders
- Hooks: `use` prefix (camelCase)
- Redux slices: camelCase (e.g., `producersSlice`)
- Test files: `*.test.tsx` or `*.spec.tsx`

## Git
- Branch naming: `spec/`, `feat/`, `fix/`, `chore/`
- Conventional commits

## Code Quality
- SOLID principles applied at module/class level
- Single Responsibility per module
- Dependency Injection (NestJS DI container)
- No business logic in controllers or repositories
