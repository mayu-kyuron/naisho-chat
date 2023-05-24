import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(process.env.HTTP_PORT).then((_value) => {
    console.log(`NestJS app starts. -> url: ${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`);
  });

  // ホットリロードを有効化
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
