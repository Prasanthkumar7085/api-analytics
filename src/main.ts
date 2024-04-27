import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { errorFormattor } from './validation';
import * as express from 'express';
import * as path from 'path';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "images"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");

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



  await app.listen(process.env.PORT || 3000);
}
bootstrap();
