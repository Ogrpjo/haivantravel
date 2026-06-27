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
  // When running from `haivantravel-backend/`, persist files to the repo-level `../upload/` folder.
  const uploadDir = join(process.cwd(), '..', 'upload');
  // Backward-compat: still serve files that were stored in `haivantravel-backend/uploads/`.
  const legacyUploadDir = join(process.cwd(), 'uploads');
  // eslint-disable-next-line no-console
  console.log('[static] /upload =>', uploadDir);
  // eslint-disable-next-line no-console
  console.log('[static] /upload (legacy) =>', legacyUploadDir);
  app.use('/upload', express.static(uploadDir));
  app.use('/upload', express.static(legacyUploadDir));

  app.use((req, res, next) => {
  const before = process.memoryUsage().heapUsed / 1024 / 1024;

  res.on("finish", () => {
    const after = process.memoryUsage().heapUsed / 1024 / 1024;

    console.log(
      `${req.method} ${req.originalUrl}`,
      `Heap: ${before.toFixed(1)}MB -> ${after.toFixed(1)}MB`
    );
  });

  next();
});
  
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
