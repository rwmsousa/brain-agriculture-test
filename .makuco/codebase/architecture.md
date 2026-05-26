# Architecture

## Overview

Fullstack application with separated frontend and backend services, orchestrated via Docker Compose.

## Backend Architecture (NestJS Layered)

```
backend/
├── src/
│   ├── modules/
│   │   ├── producers/        # Producer module
│   │   ├── farms/            # Farm module
│   │   ├── harvests/         # Harvest module
│   │   ├── crops/            # Crop module
│   │   └── dashboard/        # Dashboard/stats module
│   ├── common/               # Shared utilities, guards, pipes
│   ├── config/               # App configuration
│   └── database/             # Database setup, migrations
```

**Layers per module:**
1. Controller (HTTP/REST handlers)
2. Service (Business logic)
3. Repository (Data access via TypeORM)
4. DTOs (Data Transfer Objects)
5. Entities (TypeORM entities)

## Frontend Architecture (React + Atomic Design)

```
frontend/
├── src/
│   ├── atoms/           # Base UI components (Button, Input, Label)
│   ├── molecules/       # Composed components (FormField, Card)
│   ├── organisms/       # Complex components (ProducerForm, Dashboard)
│   ├── templates/       # Page layout templates
│   ├── pages/           # Route-level pages
│   ├── store/           # Redux store, slices, selectors
│   ├── services/        # API service layer
│   └── types/           # TypeScript interfaces/types
```

## Data Flow

```
User → React Page → Redux Action → API Service → REST API (NestJS)
                                                      ↓
                                               TypeORM → PostgreSQL
```

## Container Architecture

```
docker-compose.yml
├── frontend (React app, port 3000)
├── backend  (NestJS API, port 3001)
└── database (PostgreSQL, port 5432)
```
