import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PartnersService } from "./service/partners.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";

@Controller()
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPartnersPage(@Req() req: Request, @Res() res: Response) {

    if(req["user"].role === "admin") {
      const partners = await this.partnersService.getPartners(req["user"].id);

      res.render("admin/partners/partners", {
        admin: true,
        partners: partners,
        styles: ["/css/admin/partners/partners.css"],
        scripts: ["/js/admin/partners/partners.js"]
      });
    } else {
      throw new ForbiddenException({ message: "Only admin can see" });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPartner(@Req() req: Request, @Body() body: CreatePartnerDto) {
    if(req["user"].role === "admin") {
      return { password: await this.partnersService.createPartner(body.name) };
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
}
