import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {ProductsImages} from "./products-images.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {ProductsImagesInterface} from "./interfaces/products-images.interface";

@Injectable()
export class ProductsImagesServiceDb {
    constructor(@InjectRepository(ProductsImages) private repository: EntityRepository<ProductsImages>) {}

    async saveProductImage(productImage: ProductsImagesInterface) {
        const productImageModel = new ProductsImages();

        productImageModel.file_name = productImage.file_name;
        productImageModel.product = productImage.product;


        await this.repository.persistAndFlush(productImageModel);
    }

    async getProductsImagesAndProductsByProductsId(productsId: Array<number>) {
        // My solution ...
        let questionInQuery: string = "(";

        for(let i = 0; i < productsId.length; i++) {
            if(i < productsId.length - 1) {
                questionInQuery += "?,";
            } else {
                questionInQuery += "?)";
            }
        }
        return await this.repository
            .createQueryBuilder("a")
            .select("*")
            .leftJoinAndSelect("a.product", "b")
            .where("b.id IN " + questionInQuery, [...productsId])
            .getResult();


    }

    async deleteProductImageById(id: number) {
        await this.repository.nativeDelete({ id: id });
    }

    async deleteProductImageByProductId(productId: number) {
        await this.repository.nativeDelete({ product: productId });
    }
}
