import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'tauri://localhost', 'https://listasverduleria.free.nf'], // Especifica tu frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma los payloads a instancias de DTO
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: false, // Lanza error si hay propiedades extra
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos automáticamente
      },
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
