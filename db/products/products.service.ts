import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Products} from "./products.entity";
import {EntityRepository} from "@mikro-orm/core";
import {ProductsInterface} from "./interfaces/products.interface";

@Injectable()
export class ProductsServiceDb {
    constructor(@InjectRepository(Products) private repository: EntityRepository<Products>) {}

    async saveProductAndReturn(product: ProductsInterface) {
        const productModel = new Products();

        productModel.name = product.name;
        productModel.description = product.description;
        productModel.available = product.available;
        productModel.price = product.price;
        productModel.type = product.type;

        await this.repository.persistAndFlush(productModel);

        return productModel;
    }

    async getProductAndImagesById(id: number) {
        return await this.repository.findOne({ id: id }, { populate: ["productsImages"] });
    }

    async getProductsById(productsId: Array<number>) {
        return await this.repository.find({ id: { $in: productsId } });
    }

    async getProductsAndImagesByType(take: number, skip: number, type: string) {
        return await this.repository.find({ type: type }, { limit: take, offset: skip, populate: ["productsImages"] });
    }
    async getProductsAndImages(take: number, skip: number) {
        return await this.repository.find({  }, { limit: take, offset: skip, populate: ["productsImages"] });
    }
    async deleteProductById(id: number) {
        await this.repository.nativeDelete( { id: id });
    }
    async updateProductById(id: number, product: ProductsInterface) {
        await this.repository.nativeUpdate({ id: id }, product);
    }
}
