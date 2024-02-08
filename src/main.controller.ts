import {Controller, Get, Query, Req, Res} from '@nestjs/common';
import { Request, Response } from "express";
import {ProductsService} from "./products/service/products.service";
import { TranslateService } from "./translate/service/translate.service";
import { TranslateServiceDb } from "../db/translate/translate.service";
import { RubricsServiceDb } from "../db/rubrics/rubrics.service";

@Controller()
export class MainController {
  constructor(
    private productsService: ProductsService,
    private translateService: TranslateService,
    private translateServiceDb: TranslateServiceDb,
    private rubricsServiceDb: RubricsServiceDb
  ) {}

  @Get()
  async getMainPage(
      @Query("type") type: string,
      @Req() req: Request,
      @Res() res: Response) {
      const rubrics = JSON.parse(JSON.stringify(await this.rubricsServiceDb.getAllRubrics()));
      const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("main_page", req.cookies["iso_code_shop"]);
      const productsAndImages = await this.productsService.getProductsByType(8, 0, type, req.cookies["iso_code_shop"]);
      const maxProductsPrice = await this.productsService.getMaxPriceProducts();
      const minProductsPrice = await this.productsService.getMinPriceProducts();

      res.render("root", {
          admin: false,
          products: await this.productsService.getParseProductsWithTranslate(req.cookies["iso_code_shop"], req.cookies["basket_in_shop"], productsAndImages),
          styles: ["/css/root.css"],
          scripts: ["/js/root.js"],
          maxProductsPrice: maxProductsPrice,
          minProductsPrice: minProductsPrice,
          activeLanguage: req.cookies["iso_code_shop"],
          ...translate,
          rubrics: [...rubrics, { name: "Всі товари", active: true, id: 0 }]
      });
  }
}
