import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from "dotenv"
import { AppModule } from './app.module';
import { HTTP_PORT } from './config/app.config';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(HTTP_PORT ?? 3000);
}
bootstrap();
