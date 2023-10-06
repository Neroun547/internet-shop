import {Controller, Get, Query, Req, Res} from '@nestjs/common';
import { Request, Response } from "express";
import {ProductsService} from "./products/service/products.service";
import { TranslateService } from "./translate/service/translate.service";

@Controller()
export class MainController {
  constructor(
    private productsService: ProductsService,
    private translateService: TranslateService
  ) {}

  @Get()
  async getMainPage(
      @Query("type") type: string,
      @Req() req: Request,
      @Res() res: Response) {
      const translate = await this.translateService.getTranslateObjectByKeyAndIsoCode("main_page", req.cookies["iso_code_shop"]);
      const productsAndImages = await this.productsService.getProductsByType(8, 0, type, req.cookies["iso_code_shop"]);
      const parseData = this.productsService.parseProductsForLoadCards(productsAndImages, req.cookies["basket_in_shop"]);

      const maxProductsPrice = await this.productsService.getMaxPriceProducts();
      const minProductsPrice = await this.productsService.getMinPriceProducts();

      res.render("root", {
          admin: false,
          products: parseData,
          styles: ["/css/root.css"],
          scripts: ["/js/root.js"],
          maxProductsPrice: maxProductsPrice,
          minProductsPrice: minProductsPrice,
          activeLanguage: req.cookies["iso_code_shop"],
          ...translate
      });
  }
}
