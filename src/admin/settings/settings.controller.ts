import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SettingsService } from "./service/settings.service";
import { AuthGuard } from "../auth/guards/auth.guard";

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
}
