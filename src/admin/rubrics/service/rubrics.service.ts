import { BadRequestException, Injectable } from "@nestjs/common";
import { RubricsServiceDb } from "../../../../db/rubrics/rubrics.service";
import { RubricsTypesServiceDb } from "../../../../db/rubrics-types/rubrics-types.service";
import { ProductsServiceDb } from "../../../../db/products/products.service";
import { OrdersServiceDb } from "../../../../db/orders/orders.service";
import { ProductsImagesServiceDb } from "../../../../db/products-images/products-images.service";
import { UpdateRubricDto } from "../dto/update-rubric.dto";

@Injectable()
export class RubricsService {
  constructor(
    private rubricsServiceDb: RubricsServiceDb,
    private rubricsTypesServiceDb: RubricsTypesServiceDb,
    private productsServiceDb: ProductsServiceDb,
    private ordersServiceDb: OrdersServiceDb,
    private productImagesServiceDb: ProductsImagesServiceDb
  ) {}

  async createRubricAndReturnId(name: string, types: Array<string>): Promise<number> {
    const rubricWithTheSameName = await this.rubricsServiceDb.getRubricByName(name);

    if(rubricWithTheSameName) {
      throw new BadRequestException();
    }
    const rubricId = await this.rubricsServiceDb.createRubricAndReturnId(name, 0);

    for(let i = 0; i < types.length; i++) {
      await this.rubricsTypesServiceDb.saveRubricsType({
        name: types[i],
        rubric_id: rubricId
      })
    }
    return rubricId;
  }
  async deleteRubricById(rubricId: number) {
    const products = await this.productsServiceDb.getProductsByRubricId(rubricId);

    for(let i = 0; i < products.length; i++) {
      await this.ordersServiceDb.deleteOrdersByProductId(products[i].id);
      await this.productImagesServiceDb.deleteProductImagesByProductId(products[i].id);
    }
    await this.productsServiceDb.deleteProductsByRubricId(rubricId);
    await this.rubricsTypesServiceDb.deleteRubricTypesByRubricId(rubricId);
    await this.rubricsServiceDb.deleteRubricById(rubricId);
  }

  async updateRubric(rubric: UpdateRubricDto) {
    await this.rubricsServiceDb.updateRubricNameById(rubric.name, rubric.id);
    await this.rubricsTypesServiceDb.deleteRubricTypesByRubricId(rubric.id);

    for(let i = 0; i < rubric.rubricTypes.length; i++) {
      await this.rubricsTypesServiceDb.saveRubricsType({
        rubric_id: rubric.id,
        name: rubric.rubricTypes[i]
      });
    }
  }
}
