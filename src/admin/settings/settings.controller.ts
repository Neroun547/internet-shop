import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { SettingsService } from "./service/settings.service";
import { SaveSubscriptionDto } from "./dto/save-subscription.dto";

@Controller()
export class SettingsController {
  constructor(private service: SettingsService) {}

  @UseGuards(AuthGuard)
  @Get()
  getSettingsPage(@Res() res: Response) {
    res.render("admin/settings/settings", {
      admin: true,
      scripts: ["/js/admin/settings/settings.js", "/js/admin/settings/service-worker.js"],
      styles: ["/css/admin/settings/settings.css"]
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async saveSubscription(@Req() req: Request, @Body() body: SaveSubscriptionDto) {
    await this.service.saveSubscription(req["user"].id, body.data, body.active);

    return;
  }
}
