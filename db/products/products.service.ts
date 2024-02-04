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
        productModel.user_id = product.user_id;

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
    async getProductsAndImagesByUserId(take: number, skip: number, userId: number) {
        return await this.repository.find({ user_id: userId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
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
    async getCountAvailableProductsByUserId(userId: number) {
        return await this.repository.count({ user_id: userId, available: true });
    }
    async getCountProducts() {
        return await this.repository.count();
    }
    async getCountProductsByUserId(userId: number) {
        return await this.repository.count({ user_id: userId });
    }
    async getLastProductByNum() {
        return (await this.repository.find({}, { orderBy: { num: "DESC" }, limit: 1 }))[0];
    }
    async getLastProductByNumAndByUserId(userId: number) {
        return (await this.repository.find({ user_id: userId }, { orderBy: { num: "DESC" }, limit: 1 }))[0];
    }
    async getProductByIdAndUserId(id: number, userId: number) {
        return await this.repository.findOne({ id: id, user_id: userId });
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
    async getMaxPriceProductsByType(type: string) {
        const data = (await this.repository.find({ type: type }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProductsByType(type: string) {
        const data = (await this.repository.find({ type: type }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMaxPriceProducts() {
        const data = (await this.repository.find({ }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMaxPriceProductsByUserId(userId: number) {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProducts() {
        const data = (await this.repository.find({  }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProductsByUserId(userId: number) {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getProductsAndImagesByFilters(take: number, skip: number, priceFrom: number, priceTo: number, type: string, available?) {
        if(available !== undefined) {
            if(type) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available, type: type
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
            return await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, available: available
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
        } else {
            if(type) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, type: type
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
            return await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
        }
    }
    async getProductsAndImagesByFiltersAndUserId(take: number, skip: number, priceFrom: number, priceTo: number, type: string, userId: number, available?) {
        if(available !== undefined) {
            if(type) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available, type: type, user_id: userId
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
            return await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, available: available, user_id: userId
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
        } else {
            if(type) {
                return await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, type: type, user_id: userId
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
            }
            return await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, user_id: userId
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
        }
    }
    async getProductByNumAndUserId(num: number, userId: number) {
        return await this.repository.findOne({ num: num, user_id: userId });
    }

    async getProductsAndImagesByTypeAndUserId(take: number, skip: number, type: string, userId: number) {
        return await this.repository.find({ type: type, user_id: userId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    }

    async getAllProductsAndImagesByUserId(userId: number) {
        return await this.repository.find({ user_id: userId }, { populate: ["productsImages"] });
    }
    async deleteProductsByUserId(userId: number) {
        await this.repository.nativeDelete({ user_id: userId });
    }
}
