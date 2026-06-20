import { Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { ProductsServiceDb } from "../../../db/products/products.service";
import { CommonService } from "../../../common/common.service";
import { UploadProductInterface } from "../interfaces/upload-product.interface";
import { rename, unlink } from "fs/promises";
import { resolve } from "path";
import { TranslateServiceDb } from "../../../db/translate/translate.service";
import { OrdersServiceDb } from "../../../db/orders/orders.service";
import { ProductsImagesServiceDb } from "../../../db/products-images/products-images.service";
import { RubricsTypesServiceDb } from "../../../db/rubrics-types/rubrics-types.service";
import { ProductsInterface } from "src/db/products/interfaces/products.interface";

@Injectable()
export class ProductsServiceAdmin {
  constructor(
    private productsServiceDb: ProductsServiceDb,
    private commonService: CommonService,
    private translateServiceDb: TranslateServiceDb,
    private ordersServiceDb: OrdersServiceDb,
    private productsImagesServiceDb: ProductsImagesServiceDb,
    private rubricsTypesServiceDb: RubricsTypesServiceDb,
  ) {}

  async deleteProductImages(productImages) {
    for(let i = 0; i < productImages.length; i++) {
      try {
        await unlink(resolve("static/images/" + productImages[i].file_name));
      } catch {

      }
    }
  }

  async getProductsAndImagesByUserId(take: number, skip: number, userId: number) {
    return await this.productsServiceDb.getProductsAndImagesByUserId(take, skip, userId);
  }

  async updateProductById(id: number, product: ProductsInterface, files: Array<Express.Multer.File>, userId: number) {
    try {
      await this.productsServiceDb.updateProductByIdTransaction(id, { ...product, user_id: userId }, userId);
    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException({ message: "Невдалося оновити товар." });
    }
    if(files.length) {
      const productImages = await this.productsImagesServiceDb.getProductImagesByProductId(id);

      await this.deleteProductImages(productImages);

      await this.productsImagesServiceDb.deleteProductImagesByProductId(id);

      for(let i = 0; i < files.length; i++) {
        if(files[i].mimetype === "image/jpeg") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".jpeg");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".jpeg",
            product_id: id,
            product: id
          });
        }
        if(files[i].mimetype === "image/png") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".png");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".png",
            product_id: id,
            product: id
          });
        }
        if(files[i].mimetype === "image/jpg") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".jpg");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".jpg",
            product_id: id,
            product: id
          });
        }
      }
    }
  }

  async uploadProduct(product: UploadProductInterface, files: Array<Express.Multer.File>) {
    const lastProduct = (await this.productsServiceDb.getLastProductByNumAndByUserId(product.user_id));
    const savedProduct = await this.productsServiceDb.saveProductAndReturn({...product, num: lastProduct ? lastProduct.num + 1 : 1});

    if(savedProduct.id) {
      for(let i = 0; i < files.length; i++) {
        if(files[i].mimetype === "image/jpeg") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".jpeg");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".jpeg",
            product_id: savedProduct.id,
            product: savedProduct.id
          });
        }
        if(files[i].mimetype === "image/png") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".png");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".png",
            product_id: savedProduct.id,
            product: savedProduct.id
          });
        }
        if(files[i].mimetype === "image/jpg") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".jpg");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".jpg",
            product_id: savedProduct.id,
            product: savedProduct.id
          });
        }
      }
    }
  }

  async deleteProductById(id: number) {
    const productAndImages = await this.productsServiceDb.getProductAndImagesById(id);

    if(productAndImages && productAndImages.productsImages) {
      await this.deleteProductImages(productAndImages.productsImages);
      await this.productsImagesServiceDb.deleteProductImagesByProductId(id);
      await this.ordersServiceDb.deleteOrdersByProductId(id);
      await this.productsServiceDb.deleteProductById(id);
      await this.calculateNumsProductsAfterDeleteProduct(productAndImages.num);
    } else {
      throw new NotFoundException();
    }
  }

  async calculateNumsProductsAfterDeleteProduct(numDeleteProduct: number) {
    let numDeleteProductIncremented = numDeleteProduct;
    const productsCountAfterNum = await this.productsServiceDb.getCountProductsBiggerNum(numDeleteProduct);

    if(productsCountAfterNum > 0) {
      for(let i = 0; i < productsCountAfterNum; i++) {
        await this.productsServiceDb.updateProductsNumToPrev(numDeleteProductIncremented);
        numDeleteProductIncremented += 1;
      }
    }
  }

  async getProductsByFiltersAndAdminId(take: number, skip: number, priceFrom: number, priceTo: number, available: string, rubricId: number | null, rubricTypeNameId: number | null, adminId: number) {
    const rubricType = rubricTypeNameId !== null ? await this.rubricsTypesServiceDb.getTypeById(rubricTypeNameId) : null;

    if(available === "all") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndAdminId(take, skip, priceFrom, priceTo,  adminId, undefined, rubricId,  rubricType ? rubricType.name : null);
    }
    if(available === "not_available") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndAdminId(take, skip, priceFrom, priceTo,  adminId, false, rubricId,  rubricType ? rubricType.name : null);
    }
    if(available === "available") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndAdminId(take, skip, priceFrom, priceTo,  adminId, true, rubricId,  rubricType ? rubricType.name : null);
    }
  }
}
