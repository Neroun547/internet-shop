import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PartnersService } from "./service/partners.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { ORDERS_STEP } from "./constants";

@Controller()
export class PartnersController {
  constructor(
    private partnersService: PartnersService
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPartners(@Req() req: Request) {

    if(req["user"].role === "admin") {
      return await this.partnersService.getPartners(req["user"].id);
    } else {
      throw new ForbiddenException({ message: "Only admin can see" });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPartner(@Req() req: Request, @Body() body: CreatePartnerDto) {
    if(req["user"].role === "admin") {
      await this.partnersService.createPartner(body.name, body.password);

      return;
    }
    throw new ForbiddenException();
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  async updatePartnerName(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number, @Body() body: UpdatePartnerDto) {
    if(req["user"].role === "admin") {
      await this.partnersService.updatePartnerById(id, body.name, body.password);

      return;
    }
    throw new ForbiddenException();
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async deletePartnerById(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number) {
    if(req["user"].role === "admin") {
      await this.partnersService.deletePartnerById(id);

      return;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async getPartner(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number) {
    if(req["user"].role === "admin") {
      const data = await this.partnersService.getPartnerById(id);

      return {
        name: data.name
      }
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard)
  @Get(":id/orders")
  async getPartnerOrdersPage(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number) {
    if(req["user"].role === "admin") {
      return await this.partnersService.getOrdersByUserId(id, ORDERS_STEP, 0);
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard)
  @Get(":id/orders/load-more")
  async loadMoreOrders(
    @Param("id", new ParseIntPipe()) userId: number,
    @Query("take", new ParseIntPipe()) take: number,
    @Query("skip", new ParseIntPipe()) skip: number) {

    return { orders: await this.partnersService.getOrdersByUserId(userId, take, skip) };
  }
}
