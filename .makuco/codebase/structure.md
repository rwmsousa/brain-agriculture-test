# Project Structure

## Root

```
brain-agriculture-test/
├── .makuco/            # Makuco specs and knowledge
├── backend/            # NestJS API
├── frontend/           # React application
├── docker-compose.yml  # Container orchestration
├── README.md           # Setup instructions
└── MAKUCO.md           # Project context
```

## Backend

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules/
│   │   ├── producers/
│   │   │   ├── producers.controller.ts
│   │   │   ├── producers.service.ts
│   │   │   ├── producers.module.ts
│   │   │   ├── entities/producer.entity.ts
│   │   │   └── dto/
│   │   ├── farms/
│   │   ├── harvests/
│   │   ├── crops/
│   │   └── dashboard/
│   ├── common/
│   └── config/
├── test/
├── Dockerfile
└── package.json
```

## Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── pages/
│   ├── store/
│   │   ├── index.ts
│   │   └── slices/
│   ├── services/
│   └── types/
├── public/
├── Dockerfile
└── package.json
```
