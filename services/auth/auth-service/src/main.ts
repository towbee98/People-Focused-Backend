import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; // Import helmet
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // Import AllExceptionsFilter

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipe globally
  app.useGlobalPipes(new ValidationPipe());

  // Use helmet for security headers
  app.use(helmet());

  // Use global exception filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the Auth Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Allow requests from your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  app.enableShutdownHooks(); // Enable graceful shutdown hooks
}
bootstrap();
