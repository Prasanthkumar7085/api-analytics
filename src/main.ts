import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { errorFormattor } from './validation';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: false,
    validationError: {
      target: false
    },
    enableDebugMessages: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {

      return new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: errorFormattor(validationErrors),
        message: 'Validation failed'
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    },
    errorHttpStatusCode: 422,
    forbidUnknownValues: true,
    stopAtFirstError: true,
  }));

  app.use('/public', express.static(path.join(__dirname, '..', '//public')));

  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
