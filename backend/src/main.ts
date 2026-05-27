import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // CORS
    const allowedOrigins: string[] = ['http://localhost:3000'];

    // Allow the explicitly configured frontend URL (e.g. set via Railway variable)
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    // Auto-detect the frontend domain from RAILWAY_PUBLIC_DOMAIN when available.
    // RAILWAY_PUBLIC_DOMAIN exposes the backend's own public domain; we derive the
    // frontend URL by replacing the "backend" segment with "frontend".
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      const frontendDomain = process.env.RAILWAY_PUBLIC_DOMAIN.replace(
        'backend',
        'frontend',
      );
      const frontendUrl = `https://${frontendDomain}`;
      if (!allowedOrigins.includes(frontendUrl)) {
        allowedOrigins.push(frontendUrl);
      }
    }

    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global interceptor and filter
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('Brain Agriculture API')
      .setDescription('API for managing rural producers and farms')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 8080;
    await app.listen(port, '0.0.0.0');
    console.log(`✓ Server is listening on http://0.0.0.0:${port}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
