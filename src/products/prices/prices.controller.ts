import { Controller, Get } from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";

@Controller()
export class PricesController {
  constructor(private productsServiceDb: ProductsServiceDb) {}

  @Get("min")
  async getMinProductsPrice() {
    return { value: await this.productsServiceDb.getMinPriceProducts() };
  }

  @Get("max")
  async getMaxProductsPrice() {
    return { value: await this.productsServiceDb.getMaxPriceProducts() };
  }
}
