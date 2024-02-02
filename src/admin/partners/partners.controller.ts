import { Controller, ForbiddenException, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PartnersService } from "./service/partners.service";

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
        styles: ["/css/admin/partners/partners.css"]
      });
    } else {
      throw new ForbiddenException({ message: "Only admin can see" });
    }
  }
}
