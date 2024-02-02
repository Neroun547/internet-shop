import { Injectable } from "@nestjs/common";
import { ProductsServiceDb } from "../../../../db/products/products.service";
import { CommonService } from "../../../../common/common.service";

@Injectable()
export class ProductsServiceAdmin {
  constructor(
    private productsServiceDb: ProductsServiceDb,
    private commonService: CommonService
  ) {}

  async getProductsAndImagesByUserId(take: number, skip: number, userId: number) {
    const serializedProductsAndImages = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductsAndImagesByUserId(take, skip, userId)));

    return serializedProductsAndImages.map(el => {
      return {
        ...el,
        type: this.commonService.getTypeProductByValue(el.type)
      }
    });
  }
}
