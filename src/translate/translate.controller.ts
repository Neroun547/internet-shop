import { Controller, Param, Patch, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class TranslateController {
  @Patch(":iso_code")
  changeLanguage(@Param("iso_code") isoCode: string, @Res() res: Response) {
    res.cookie("iso_code_shop", isoCode);

    res.sendStatus(200);
  }
}
