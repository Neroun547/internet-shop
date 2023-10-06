import { Controller, Get, Param, Patch, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";

@Controller()
export class TranslateController {
  @Patch(":iso_code")
  changeLanguage(@Param("iso_code") isoCode: string, @Res() res: Response) {
    res.cookie("iso_code_shop", isoCode);

    res.sendStatus(200);
  }

  @Get("active-language")
  getActiveLanguage(@Req() req: Request, @Res() res: Response) {
    res.send({ iso_code: req.cookies["iso_code_shop"] });
  }
}
