import { Loaded } from "@mikro-orm/core";
import { Products } from "./products.entity";
import { ProductsInterface } from "./interfaces/products.interface";
import { ProductsImagesMapper } from "../products-images/products-images.mapper";
import { getRubricIdFromEntity, getUserIdFromEntity } from "src/common/utils";

export class ProductsMapper {
    static toDomain(entity: Loaded<Products>): ProductsInterface {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            available: entity.available,
            type: entity.type,
            num: entity.num,
            user_id: getUserIdFromEntity(entity) ?? 0,
            rubric_id: getRubricIdFromEntity(entity) ?? 0
        }
    }
    static toDomainWithLoadedProductsImages(entity: Loaded<Products>): ProductsInterface {
        if(entity.productsImages) {            
            return {
                id: entity.id,
                name: entity.name,
                description: entity.description,
                price: entity.price,
                available: entity.available,
                type: entity.type,
                num: entity.num,
                user_id: getUserIdFromEntity(entity) ?? 0,
                rubric_id: getRubricIdFromEntity(entity) ?? 0,
                productsImages: entity.productsImages ? entity.productsImages.map(item => ProductsImagesMapper.toDomain(item)) : undefined 
            } 
        }  
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            available: entity.available,
            type: entity.type,
            num: entity.num,
            user_id: getUserIdFromEntity(entity) ?? 0,
            rubric_id: getRubricIdFromEntity(entity) ?? 0,  
        }
    }
    static toPersist(params: ProductsInterface): Products {
        const newModel = new Products();

        for(let key in params) {
            newModel[key] = params[key];
        }
        newModel.user = params.user_id;

        return newModel;
    }
}
