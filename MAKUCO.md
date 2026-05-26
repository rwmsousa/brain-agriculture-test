# Brain Agriculture — Makuco Project Context

## Project Overview

Brain Agriculture is a fullstack web application for managing rural producer registrations. It is a technical test project requiring both frontend and backend development with Docker Compose orchestration.

## Domain

Agricultural management system for tracking rural producers, their properties (farms), harvests, and planted crops.

## Stack

- **Backend**: TypeScript + NestJS + PostgreSQL + TypeORM
- **Frontend**: TypeScript + ReactJS + Redux + Styled Components or Emotion
- **Testing**: Jest + React Testing Library (frontend), Jest (backend)
- **Infrastructure**: Docker Compose (3 containers: frontend, backend, database)

## Key Domain Entities

- **Producer (Produtor Rural)**: CPF/CNPJ, name
- **Farm (Fazenda/Propriedade Rural)**: name, city, state, total area, arable area, vegetation area
- **Harvest (Safra)**: year/name (e.g., Safra 2021)
- **Crop (Cultura)**: type of crop planted (e.g., Soja, Milho, Café)
- **PlantedCrop (Cultura Plantada)**: association between Farm, Harvest, and Crop

## Core Business Rules

1. CRUD operations for rural producers
2. CPF/CNPJ validation
3. Arable area + vegetation area must not exceed total farm area
4. Multiple crops per farm per harvest
5. Producer can have 0..N farms
6. Farm can have 0..N planted crops per harvest

## Architecture Style

Layered architecture with SOLID, KISS, Clean Code principles. API Contracts via OpenAPI/Swagger.
