import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  const uploadDir = join(__dirname, '..', '..', 'upload');
  const legacyUploadDir = join(__dirname, '..', 'uploads');
  // eslint-disable-next-line no-console
  console.log('[static] /upload =>', uploadDir);
  // eslint-disable-next-line no-console
  console.log('[static] /upload (legacy) =>', legacyUploadDir);
  app.use('/upload', express.static(uploadDir));
  app.use('/upload', express.static(legacyUploadDir));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 2031);
}
bootstrap();