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
        productModel.num = product.num;

        await this.repository.persistAndFlush(productModel);

        return productModel;
    }

    async getProductById(id: number) {
        return await this.repository.findOne({ id: id });
    }

    async getProductAndImagesById(id: number) {
        return await this.repository.findOne({ id: id }, { populate: ["productsImages"] });
    }

    async getProductsById(productsId: Array<number>) {
        return await this.repository.find({ id: { $in: productsId } });
    }

    async getProductsAndImagesByType(take: number, skip: number, type: string) {
        return await this.repository.find({ type: type }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    }
    async getProductsAndImages(take: number, skip: number) {
        return await this.repository.find({  }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    }
    async deleteProductById(id: number) {
        await this.repository.nativeDelete( { id: id });
    }
    async updateProductById(id: number, product: ProductsInterface) {
        await this.repository.nativeUpdate({ id: id }, product);
    }
    async getCountAvailableProducts() {
        return await this.repository.count({ available: true });
    }
    async getCountProducts() {
        return await this.repository.count();
    }
    async getLastProductByNum() {
        return (await this.repository.find({}, { orderBy: { num: "DESC" }, limit: 1 }))[0];
    }
    async getProductByNum(num: number) {
        return await this.repository.findOne({ num: num });
    }
    async updateProductsNumToPrev(num: number) {
        await this.repository.nativeUpdate({ num: num + 1 }, { num });
    }
    async getCountProductsBiggerNum(num: number) {
        return await this.repository.count({ num: { $gt: num } });
    }
}
