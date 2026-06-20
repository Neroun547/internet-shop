import { Loaded } from "@mikro-orm/core";
import { ProductsImages } from "./products-images.entity";
import { ProductsImagesInterface } from "./interfaces/products-images.interface";
import { ProductsMapper } from "../products/products.mapper";
import { getProductIdFromEntity } from "src/common/utils";

export class ProductsImagesMapper {
    static toDomain(entity: Loaded<ProductsImages>): ProductsImagesInterface {
        return {
            id: entity.id,
            file_name: entity.file_name,
            product_id: getProductIdFromEntity(entity) ?? 0
        }
    }  
    static toDomainWithProduct(entity: Loaded<ProductsImages>): ProductsImagesInterface {
        return {
            id: entity.id,
            file_name: entity.file_name,
            product_id: getProductIdFromEntity(entity) ?? 0,
            product: typeof entity.product !== "number" ? ProductsMapper.toDomain(entity.product) : entity.product
        }
    }
    static toPersist(data: ProductsImagesInterface) {
        const newModel = new ProductsImages();

        for(let key in data) {
            newModel[key] = data[key];
        }
        return newModel;
    }  
}

