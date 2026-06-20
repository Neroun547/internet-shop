import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Products} from "./products.entity";
import {EntityRepository, IsolationLevel} from "@mikro-orm/core";
import {ProductsInterface} from "./interfaces/products.interface";
import { ProductsMapper } from "./products.mapper";

@Injectable()
export class ProductsServiceDb {
    constructor(@InjectRepository(Products) private repository: EntityRepository<Products>) {}


    updateProductByIdTransaction(id: number, product: ProductsInterface, userId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.repository.getEntityManager().transactional(async (em) => {
                try {
                    const repository = em.getRepository(Products);

                    const productInDbWithSimilarNum = await repository.findOne({ num: product.num, user_id: userId });

                    if(productInDbWithSimilarNum) {
                        const parsedProductWithSimilarNum = ProductsMapper.toDomain(productInDbWithSimilarNum);
                        const updateProductInDb = await repository.findOne({ id: id, user_id: userId });

                        if(updateProductInDb) {
                            if(parsedProductWithSimilarNum.id) {
                                await repository.nativeUpdate({ id: parsedProductWithSimilarNum.id }, { num: updateProductInDb.num });
                            }
                        }
                    }
                    await repository.nativeUpdate({ id: id }, {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        available: product.available,
                        type: product.type,
                        num: product.num,
                        user_id: userId,
                        rubric_id: product.rubric_id
                    });

                    resolve();
                } catch(error) {
                    reject(error);
                }
            }, { isolationLevel: IsolationLevel.REPEATABLE_READ });
        });
    }

    async saveProductAndReturn(product: ProductsInterface): Promise<ProductsInterface> {
        const productModel = ProductsMapper.toPersist(product);

        await this.repository.getEntityManager().persist(productModel).flush();

        return ProductsMapper.toDomain(productModel);
    }

    async getProductById(id: number): Promise<ProductsInterface | null> {
        const data = await this.repository.findOne({ id: id });

        if(!data) {
            return null;
        }
        return ProductsMapper.toDomain(data);
    }
    async getProductAndImagesById(id: number): Promise<ProductsInterface | null> {
        const data = await this.repository.findOne({ id: id }, { populate: ["productsImages"] });

        if(!data) {
            return null;
        }
        return await ProductsMapper.toDomainWithLoadedProductsImages(data);
    }

    async getProductsAndImagesByType(take: number, skip: number, type: string, rubricId: number | undefined, productName?: string): Promise<ProductsInterface[]> {
        if(productName) {
            const data = await this.repository.find({ type: type, rubric_id: rubricId, name: { $like: "%" + productName + "%" } }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        
            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        } else {
            const data = await this.repository.find({ type: type, rubric_id: rubricId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        
            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        }
    }
    async getProductsAndImages(take: number, skip: number, productName?: string): Promise<ProductsInterface[]> {
        if(productName) {
            const data = await this.repository.find({ name: { $like: "%" + productName + "%" } }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        
            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        } else {
            const data = await this.repository.find({  }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });

            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        }
    }
    async getProductsAndImagesByUserId(take: number, skip: number, userId: number): Promise<ProductsInterface[]> {
        const data = await this.repository.find({ user_id: userId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    
        return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
    }
    async deleteProductById(id: number): Promise<void> {
        await this.repository.nativeDelete( { id: id });
    }
    async getCountAvailableProductsByUserId(userId: number): Promise<number> {
        return await this.repository.count({ user_id: userId, available: true });
    }
    async getCountProductsByUserId(userId: number): Promise<number> {
        return await this.repository.count({ user_id: userId });
    }
    async getLastProductByNumAndByUserId(userId: number): Promise<ProductsInterface | null> {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { num: "DESC" }, limit: 1 }))[0];

        if(!data) {
            return null;
        }
        return ProductsMapper.toDomain(data);
    }
    async getProductByIdAndUserId(id: number, userId: number): Promise<ProductsInterface | null> {
        const data = await this.repository.findOne({ id: id, user_id: userId });

        if(!data) {
            return null;
        }
        return ProductsMapper.toDomain(data);
    }
    async updateProductsNumToPrev(num: number): Promise<void> {
        await this.repository.nativeUpdate({ num: num + 1 }, { num });
    }
    async getCountProductsBiggerNum(num: number): Promise<number> {
        return await this.repository.count({ num: { $gt: num } });
    }
    async getMaxPriceProductsByType(type: string): Promise<number | null> {
        const data = (await this.repository.find({ type: type }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProductsByType(type: string): Promise<number | null> {
        const data = (await this.repository.find({ type: type }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMaxPriceProducts(): Promise<number | null> {
        const data = (await this.repository.find({ }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMaxPriceProductsByUserId(userId: number): Promise<number | null> {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProducts(): Promise<number | null> {
        const data = (await this.repository.find({  }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getMinPriceProductsByUserId(userId: number): Promise<number | null> {
        const data = (await this.repository.find({ user_id: userId }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }
    async getProductsAndImagesByFilters(take: number, skip: number, priceFrom: number, priceTo: number, type: string, available?: undefined | boolean, productName?: string): Promise<ProductsInterface[]> {

        if(available !== undefined) {
            if(type) {
                if(productName) {
                    const data = await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, available: available, type: type, name: { $like: "%" + productName + "%" }
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                    return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
                } else {
                    const data = await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, available: available, type: type,
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                    return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
                }
            }
            if(productName) {
                const data = await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available, name: { $like: "%" + productName + "%" }
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
            } else {
                const data = await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});
                
                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
            }
        } else {
            if(type) {
                if(productName) {
                    const data = await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, type: type, name: { $like: "%" + productName + "%" }
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                    return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
                } else {
                    const data = await this.repository.find({
                        price: {
                            $gte: priceFrom,
                            $lte: priceTo
                        }, type: type
                    }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                    return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
                }
            }
            if(productName) {
                const data = await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, name: { $like: "%" + productName + "%" }
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
            } else {
                const data = await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
            }
        }
    }
    async getProductsAndImagesByFiltersAndUserId(take: number, skip: number, priceFrom: number, priceTo: number, type: string, userId: number, available?): Promise<ProductsInterface[]> {
        if(available !== undefined) {
            if(type) {
                const data = await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, available: available, type: type, user_id: userId
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
            }
            const data = await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, available: available, user_id: userId
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        } else {
            if(type) {
                const data = await this.repository.find({
                    price: {
                        $gte: priceFrom,
                        $lte: priceTo
                    }, type: type, user_id: userId
                }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
            }
            const data = await this.repository.find({
                price: {
                    $gte: priceFrom,
                    $lte: priceTo
                }, user_id: userId
            }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        }
    }
    async getProductByNumAndUserId(num: number, userId: number): Promise<ProductsInterface | null> {
        const data = await this.repository.findOne({ num: num, user_id: userId });

        if(!data) {
            return null;
        }
        return ProductsMapper.toDomain(data);
    }

    async getProductsAndImagesByTypeAndUserId(take: number, skip: number, type: string, userId: number): Promise<ProductsInterface[]> {
        const data = await this.repository.find({ type: type, user_id: userId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
    
        return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
    }

    async getAllProductsAndImagesByUserId(userId: number): Promise<ProductsInterface[]> {
        const data = await this.repository.find({ user_id: userId }, { populate: ["productsImages"] });

        return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
    }
    async deleteProductsByUserId(userId: number) {
        await this.repository.nativeDelete({ user_id: userId });
    }
    async getProductsAndImagesByRubricId(rubricId: number, take: number, skip: number, productName?: string): Promise<ProductsInterface[]> {
        if(productName) {
            const data = await this.repository.find({ rubric_id: rubricId, name: { $like: "%" + productName + "%" } }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        
            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        } else {
            const data = await this.repository.find({ rubric_id: rubricId }, { limit: take, offset: skip, populate: ["productsImages"], orderBy: { num: "ASC" } });
        
            return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
        }
    }

    async getMaxPriceProductsByRubricId(rubricId: number): Promise<number | null> {
        const data = (await this.repository.find({ rubric_id: rubricId }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }

    async getMinPriceProductsByRubricId(rubricId: number): Promise<number | null> {
        const data = (await this.repository.find({ rubric_id: rubricId }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }

  async getProductsAndImagesByFiltersAndRubricId(take: number, skip: number, priceFrom: number, priceTo: number, type: any, available: boolean | undefined, rubricId: number, productName?: string): Promise<ProductsInterface[]> {
      if(available !== undefined) {
          if(type) {
              if(productName) {
                const data = await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, available: available, type: type, name: { $like: "%" + productName + "%" }
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                  return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
              } else {
                const data = await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, available: available, type: type
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
              }
          }
          if(productName) {
              const data = await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }, available: available, name: { $like: "%" + productName + "%" }
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

              return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
          } else {
              const data = await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }, available: available
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

              return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
          }
      } else {
          if(type) {
              if(productName) {
                  const data = await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, type: type, name: { $like: "%" + productName + "%" }
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                  return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
              } else {
                  const data =  await this.repository.find({
                      rubric_id: rubricId,
                      price: {
                          $gte: priceFrom,
                          $lte: priceTo
                      }, type: type
                  }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

                  return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
              }
          }
          if(productName) {
              const data = await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }, name: { $like: "%" + productName + "%" }
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

              return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
          } else {
              const data = await this.repository.find({
                  rubric_id: rubricId,
                  price: {
                      $gte: priceFrom,
                      $lte: priceTo
                  }
              }, {limit: take, offset: skip, populate: ["productsImages"], orderBy: {num: "ASC"}});

              return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
          }
      }
  }
  async deleteProductsByRubricId(rubricId: number): Promise<void> {
        await this.repository.nativeDelete({ rubric_id: rubricId });
  }

  async getProductsByRubricId(rubricId: number): Promise<ProductsInterface[]> {
        const data = await this.repository.find({ rubric_id: rubricId });

        return data.map(item => ProductsMapper.toDomain(item));
  }

  async getProductsAndImagesLikeName(take: number, skip: number, name: string): Promise<ProductsInterface[]> {
        const data = await this.repository.find({ name: { $like: "%" + name + "%" } }, { populate: ["productsImages"], offset: skip, limit: take });
  
        return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));  
  }

  async getProductsAndImagesLikeNameByUserId(take: number, skip: number, name: string, userId: number): Promise<ProductsInterface[]> {
        const data = await this.repository.find({ name: { $like: "%" + name + "%" }, user_id: userId }, { populate: ["productsImages"], offset: skip, limit: take });
  
        return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
  }

  async getMaxPriceProductsLikeName(name: string): Promise<number | null> {
        const data = (await this.repository.find({ name: { $like: "%" + name + "%" } }, { orderBy: { price: "DESC" }, limit: 1 }))[0];

        return data ? data.price : null;
  }

    async getMinPriceProductsLikeName(name: string): Promise<number | null> {
        const data = (await this.repository.find({ name: { $like: "%" + name + "%" } }, { orderBy: { price: "ASC" }, limit: 1 }))[0];

        return data ? data.price : null;
    }

    async getProductsAndImagesByFiltersAndAdminId(take: number, skip: number, priceFrom: number, priceTo: number, adminId: number, available: boolean | undefined, rubricId: number | null, rubricTypeName: string | null): Promise<ProductsInterface[]> {
        const filtersObject: { [key: string]: any } = {
            user_id: adminId
        };

        if(typeof priceFrom === "number" && typeof priceTo === "number" && !isNaN(priceFrom) && !isNaN(priceTo)) {
            filtersObject.price = { $gte: priceFrom, $lte: priceTo };
        }
        if(available !== undefined) {
            filtersObject.available = available;
        }
        if(rubricId) {
            filtersObject.rubric_id = rubricId;

            if(rubricTypeName) {
                filtersObject.type = rubricTypeName;
            }
        }
        const data = await this.repository.find(filtersObject, { offset: skip, limit: take, populate: ["productsImages"], fields: ["*"], orderBy: {num: "ASC"} });

        return data.map(item => ProductsMapper.toDomainWithLoadedProductsImages(item));
    }
}
