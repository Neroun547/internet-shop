import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { ProductsServiceDb } from "../../../../db/products/products.service";
import { CommonService } from "../../../../common/common.service";
import { translateTypeProduct } from "../../../../constants";
import { UploadProductInterface } from "../interfaces/upload-product.interface";
import { rename, unlink } from "fs/promises";
import { resolve } from "path";
import { TranslateServiceDb } from "../../../../db/translate/translate.service";
import { OrdersServiceDb } from "../../../../db/orders/orders.service";
import { ProductsImagesServiceDb } from "../../../../db/products-images/products-images.service";

@Injectable()
export class ProductsServiceAdmin {
  constructor(
    private productsServiceDb: ProductsServiceDb,
    private commonService: CommonService,
    private translateServiceDb: TranslateServiceDb,
    private ordersServiceDb: OrdersServiceDb,
    private productsImagesServiceDb: ProductsImagesServiceDb
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
    const serializedProductsAndImages = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductsAndImagesByUserId(take, skip, userId)));

    return serializedProductsAndImages.map(el => {
      return {
        ...el
      }
    });
  }
  async getProductsByFiltersAndUserId(take: number, skip: number, available: string, priceFrom: number, priceTo: number, type: string, userId: number) {
    if(available === "all") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndUserId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], userId);
    }
    if(available === "not_available") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndUserId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], userId, false);
    }
    if(available === "available") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndUserId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], userId, true);
    }
  }

  async getProductsByTypeAndUserId(take: number, skip: number, type: string, userId: number) {
    if(!type) {
      return await this.productsServiceDb.getProductsAndImagesByUserId(take, skip, userId);
    }
    return await this.productsServiceDb.getProductsAndImagesByTypeAndUserId(take, skip, translateTypeProduct[type], userId);
  }

  async updateProductById(id: number, product: UploadProductInterface, files: Array<Express.Multer.File>, userId: number) {
    const productInDbWithSimilarNum = JSON.parse(JSON.stringify(await this.productsServiceDb.getProductByNumAndUserId(product.num, userId)));

    if(productInDbWithSimilarNum) {
      const updatedProductInDb = await this.productsServiceDb.getProductByIdAndUserId(id, userId);

      delete productInDbWithSimilarNum.productsImages;

      await this.productsServiceDb.updateProductById(productInDbWithSimilarNum.id, { ...productInDbWithSimilarNum, num: updatedProductInDb.num });
    }
    await this.productsServiceDb.updateProductById(id, {
      name: product.name,
      description: product.description,
      price: product.price,
      available: product.available,
      type: product.type,
      num: product.num,
      user_id: userId,
      rubric_id: product.rubric_id
    });

    if(files.length) {
      const productImages = await this.productsImagesServiceDb.getProductImagesByProductId(id);

      await this.deleteProductImages(productImages);

      await this.productsImagesServiceDb.deleteProductImagesByProductId(id);

      for(let i = 0; i < files.length; i++) {
        if(files[i].mimetype === "image/jpeg") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".jpeg");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".jpeg",
            product: id
          });
        }
        if(files[i].mimetype === "image/png") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".png");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".png",
            product: id
          });
        }
        if(files[i].mimetype === "image/jpg") {
          await rename(files[i].path, "static/images/" + files[i].filename + ".jpg");
          await this.productsImagesServiceDb.saveProductImage({
            file_name: files[i].filename + ".jpg",
            product: id
          });
        }
      }
    }
    const translateProductTitleInDb = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + id, "en");

    if(translateProductTitleInDb) {
      await this.translateServiceDb.updateTranslateByKeyAndIsoCode("product_translate_" + id, product.translate, product.translate_language);
    } else if(!translateProductTitleInDb && product.translate && product.translate.length) {
      await this.translateServiceDb.saveTranslate("product_translate_" + id, product.translate, product.translate_language);
    }
    const translateProductDescriptionInDb = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_description_" + id, product.translate_language);

    if(translateProductDescriptionInDb) {
      await this.translateServiceDb.updateTranslateByKeyAndIsoCode("product_translate_description_" + id, product.translate_description, product.translate_language_description);
    } else if(!translateProductDescriptionInDb && product.translate_description && product.translate_description.length) {
      await this.translateServiceDb.saveTranslate("product_translate_description_" + id, product.translate_description, product.translate_language_description);
    }
  }

  async uploadProduct(product: UploadProductInterface, files: Array<Express.Multer.File>) {
    const lastProduct = (await this.productsServiceDb.getLastProductByNumAndByUserId(product.user_id));
    const savedProduct = await this.productsServiceDb.saveProductAndReturn({...product, num: lastProduct ? lastProduct.num + 1 : 1});

    for(let i = 0; i < files.length; i++) {
      if(files[i].mimetype === "image/jpeg") {
        await rename(files[i].path, "static/images/" + files[i].filename + ".jpeg");
        await this.productsImagesServiceDb.saveProductImage({
          file_name: files[i].filename + ".jpeg",
          product: savedProduct.id
        });
      }
      if(files[i].mimetype === "image/png") {
        await rename(files[i].path, "static/images/" + files[i].filename + ".png");
        await this.productsImagesServiceDb.saveProductImage({
          file_name: files[i].filename + ".png",
          product: savedProduct.id
        });
      }
      if(files[i].mimetype === "image/jpg") {
        await rename(files[i].path, "static/images/" + files[i].filename + ".jpg");
        await this.productsImagesServiceDb.saveProductImage({
          file_name: files[i].filename + ".jpg",
          product: savedProduct.id
        });
      }
    }
    await this.translateServiceDb.saveTranslate("product_translate_" + savedProduct.id, product.translate, product.translate_language);
    await this.translateServiceDb.saveTranslate("product_translate_description_" + savedProduct.id, product.translate_description, product.translate_language_description)
  }

  async deleteProductById(id: number) {
    const productAndImages = await this.productsServiceDb.getProductAndImagesById(id);

    if(productAndImages && productAndImages.productsImages.length) {
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

  async getProductsByFiltersAndAdminId(take: number, skip: number, type: string, priceFrom: number, priceTo: number, available: string, adminId: number) {
    if(available === "all") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndAdminId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], adminId, undefined);
    }
    if(available === "not_available") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndAdminId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], adminId, false);
    }
    if(available === "available") {
      return await this.productsServiceDb.getProductsAndImagesByFiltersAndAdminId(take, skip, priceFrom, priceTo, type === "all" ? "" : translateTypeProduct[type], adminId, true);
    }
  }

  // TODO Maybe better make another file with files validator
  checkFilesSize(files: Array<any>) {
    for(let i = 0; i < files.length; i++) {
      if(files[i].size >= 10000000) {
        throw new BadRequestException();
      }
    }
  }
}
