import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { NestExpressApplication } from "@nestjs/platform-express";
import { resolve } from "path";
import * as hbs from "express-handlebars";
import * as cookieParser from 'cookie-parser';
import {HttpExceptionFilter} from "../error-filter/error-filter";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(resolve( "static"));
  app.setBaseViewsDir(resolve( "views"));
  app.setViewEngine("hbs");

  app.engine("hbs", hbs({
    extname: "hbs",
    partialsDir: resolve( "views/partials")
  }));

  await app.listen(3000);
}
bootstrap();
