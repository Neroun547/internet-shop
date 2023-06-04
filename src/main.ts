import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { NestExpressApplication } from "@nestjs/platform-express";
import { resolve } from "path";
import * as hbs from "express-handlebars";
import * as cookieParser from 'cookie-parser';
import {ValidationPipe} from "@nestjs/common";
import { statuses } from "../constants";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(resolve( "static"));
  app.setBaseViewsDir(resolve( "views"));
  app.setViewEngine("hbs");

  app.engine("hbs", hbs({
    extname: "hbs",
    partialsDir: resolve( "views/partials"),
    helpers: {
      equals (value1, value2) {
        return value1 === value2;
      },
      haveStatus (status) {
        return !!statuses.find((el) => el === status);
      },
      isNotStatus (status) {
        return status === null || status === "";
      }
    }
  }));

  await app.listen(3000);
}
bootstrap();
