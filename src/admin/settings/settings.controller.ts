import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { SettingsService } from "./service/settings.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Request } from "express";

// TODO in feature

@Controller()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @UseGuards(AuthGuard)
  @Get("public-key-push-messages")
  getPublicKeyForPushMessages() {
    return { value: process.env.PUSH_MESSAGES_PUBLIC_KEY };
  }

  @UseGuards(AuthGuard)
  @Post("register-push-messages")
  async registerPushMessages(@Body() body) {
    await this.settingsService.registerPushMessages(body.subscription);

    return;
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateSettings(@Body() body: UpdateSettingsDto, @Req() req: Request) {
    await this.settingsService.updateSettings(body, req["user"].id);

    return;
  }

  @UseGuards(AuthGuard)
  @Get()
  async getSettings(@Req() req: Request) {
    return await this.settingsService.getSettingsByUserId(req["user"].id);
  }
}
