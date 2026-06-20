import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {ProductsImages} from "./products-images.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {ProductsImagesInterface} from "./interfaces/products-images.interface";
import { ProductsImagesMapper } from "./products-images.mapper";

@Injectable()
export class ProductsImagesServiceDb {
    constructor(@InjectRepository(ProductsImages) private repository: EntityRepository<ProductsImages>) {}

    async saveProductImage(productImage: ProductsImagesInterface): Promise<void> {
        const productImageModel = ProductsImagesMapper.toPersist(productImage);

        await this.repository.getEntityManager().persist(productImageModel).flush();
    }

    async getProductsImagesAndProductsByProductsId(productsId: Array<number>): Promise<ProductsImagesInterface[]> {
        // My solution ...
        let questionInQuery: string = "(";

        for(let i = 0; i < productsId.length; i++) {
            if(i < productsId.length - 1) {
                questionInQuery += "?,";
            } else {
                questionInQuery += "?)";
            }
        }
        const data = await this.repository
            .createQueryBuilder("a")
            .select("*")
            .leftJoinAndSelect("a.product", "b")
            .where("b.id IN " + questionInQuery, [...productsId])
            .getResult();

        return data.map(item => ProductsImagesMapper.toDomain(item));
    }

    async getProductImagesByProductId(productId: number): Promise<ProductsImagesInterface[]> {
        const data = await this.repository.find({ product: productId });

        return data.map(item => ProductsImagesMapper.toDomain(item));
    }

    async deleteProductImageById(id: number): Promise<void> {
        await this.repository.nativeDelete({ id: id });
    }

    async deleteProductImagesByProductId(productId: number): Promise<void> {
        await this.repository.nativeDelete({ product: productId });
    }
}
