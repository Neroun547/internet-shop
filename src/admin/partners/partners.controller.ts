import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PartnersService } from "./service/partners.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerNameDto } from "./dto/update-partner-name.dto";

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
  @Patch("new-name/:id")
  async updatePartnerName(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number, @Body() body: UpdatePartnerNameDto) {
    if(req["user"].role === "admin") {
      await this.partnersService.updatePartnerNameById(id, body.name);

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
  @Get("info-page/:id/settings")
  async getPartnerSettingsPage(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number, @Res() res: Response) {
    if(req["user"].role === "admin") {
      const partner = await this.partnersService.getPartnerById(id);

      res.render("admin/partners/partner-settings", {
        admin: true,
        id: partner.id,
        name: partner.name,
        styles: ["/css/admin/partners/partner-settings.css"],
        scripts: ["/js/admin/partners/partner-settings.js"]
      });
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard)
  @Get("info-page/:id")
  async getInfoPartnerPage(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number, @Res() res: Response) {

    if(req["user"].role === "admin") {
      const partner = await this.partnersService.getPartnerById(id);

      res.render("admin/partners/partner-info", {
        admin: true,
        id: partner.id,
        name: partner.name,
        styles: ["/css/admin/partners/partner-info.css"]
      });
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch("generate-new-password/:id")
  async generateNewPassword(@Req() req: Request, @Param("id") id: number) {

    if(req["user"].role === "admin") {
      return { password: await this.partnersService.generateNewPasswordById(id) };
    }
    throw new ForbiddenException();
  }
}
