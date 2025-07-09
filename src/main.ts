import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationInterceptor } from './helpers/interceptors/validation-exception.interceptor';
import { UnauthorizedInterceptor } from './helpers/interceptors/unauthorized-exception.interceptor';
import { ServerErrorInterceptor } from './helpers/interceptors/server-exception.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(configService.get<string>('API_PREFIX'));
  app.useGlobalInterceptors(new ValidationInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.useGlobalInterceptors(new ServerErrorInterceptor());
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Aura Master Mind')
    .setDescription('Aura Master Mind Api Documentation')
    .setVersion('1.0.0')
    .addTag('Aura Master Mind')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors();
  await app.listen(configService.get<string>('APP_PORT'));
}
bootstrap();
