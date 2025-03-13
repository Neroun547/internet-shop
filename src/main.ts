import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { NestExpressApplication } from "@nestjs/platform-express";
import { resolve } from "path";
import * as cookieParser from 'cookie-parser';
import {ValidationPipe} from "@nestjs/common";
const express = require("express");
const cors = require("cors");

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);

  app.useStaticAssets(resolve( "static"));

  app.use(cors());

  app.setGlobalPrefix("/api");
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({limit: '50mb', extended: true}));

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
