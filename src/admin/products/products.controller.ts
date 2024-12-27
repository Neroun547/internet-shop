import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param, ParseFloatPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UploadedFiles,
    UseFilters,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "../auth/guards/auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductsService } from "../../products/service/products.service";
import { ProductsServiceDb } from "../../../db/products/products.service";
import { HttpExceptionFilter } from "../../../error-filters/error-filter-admin";
import { translateTypeProduct } from "../../../constants";
import { TranslateServiceDb } from "../../../db/translate/translate.service";
import { ProductsServiceAdmin } from "./service/products.service";
import { RubricsServiceDb } from "../../../db/rubrics/rubrics.service";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ProductsController {
    constructor(
        private productsService: ProductsService,
        private productsServiceDb: ProductsServiceDb,
        private translateServiceDb: TranslateServiceDb,
        private productsServiceAdmin: ProductsServiceAdmin,
        private rubricsServiceDb: RubricsServiceDb
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async getProductsPage(@Req() req: Request, @Res() res: Response) {
        const productsAndImages = await this.productsServiceAdmin.getProductsAndImagesByUserId(20, 0, req["user"].id);
        const parseProductsAndImages = await this.productsService.parseProductsForLoadCards(productsAndImages, "");

        const countProducts = await this.productsServiceDb.getCountProductsByUserId(req["user"].id);
        const countAvailableProducts = await this.productsServiceDb.getCountAvailableProductsByUserId(req["user"].id);

        const minProductsPrice = await this.productsServiceDb.getMinPriceProductsByUserId(req["user"].id);
        const maxProductsPrice = await this.productsServiceDb.getMaxPriceProductsByUserId(req["user"].id);

        const allRubrics = await this.rubricsServiceDb.getAllRubrics();

        //@ts-ignore
        allRubrics.unshift({ name: "Всі", id: 0 });

        res.render("admin/products/products", {
            auth: true,
            admin: true,
            products: parseProductsAndImages,
            countProducts: countProducts,
            loadMore: countProducts > 20,
            countAvailableProducts: countAvailableProducts,
            styles: ["/css/admin/products/products.css"],
            scripts: ["/js/admin/products/products.js"],
            minProductsPrice: minProductsPrice,
            maxProductsPrice: maxProductsPrice,
            partner: req["user"].role !== "admin",
            allRubrics: allRubrics
        });
    }

    @UseGuards(AuthGuard)
    @Get("load-more")
    async loadMoreProducts(
      @Query("take", new ParseIntPipe()) take: number,
      @Query("skip", new ParseIntPipe()) skip: number,
      @Query("type") type: string,
      @Query("available") available: string,
      @Query("priceFrom") priceFrom: number,
      @Query("priceTo") priceTo: number,
      @Query("rubricTypeNameId") rubricTypeNameId: string,
      @Query("rubricId") rubricId: string,
      @Req() req: Request
    ) {
        return await this.productsServiceAdmin.getProductsByFiltersAndAdminId(take, skip, Number(priceFrom), Number(priceTo), available, isNaN(Number(rubricId)) ? null : Number(rubricId), isNaN(Number(rubricTypeNameId)) ? null : Number(rubricTypeNameId), req["user"].id);
    }

    @UseGuards(AuthGuard)
    @Get("upload-product")
    async getUploadProductPage(@Res() res: Response, @Req() req: Request) {
        const rubrics = await this.rubricsServiceDb.getAllRubrics();

        res.render("admin/products/upload-product", {
            auth: true,
            admin: true,
            styles: ["/css/admin/products/upload-product.css"],
            scripts: ["/js/admin/products/upload-product.js"],
            rubrics: rubrics.filter(el => el.selected_default !== 1),
            selectedRubric: rubrics.find(el => el.selected_default === 1),
            partner: req["user"].role !== "admin"
        });
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('files', 5, {
        fileFilter(req: any, file: { fieldname: string; originalname: string; encoding: string; mimetype: string; size: number; destination: string; filename: string; path: string; buffer: Buffer }, callback: (error: (Error | null), acceptFile: boolean) => void) {
            if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png") {
                callback(new BadRequestException(), false);

                return;
            }
            callback(null, true);
        }
    }))
    @Post()
    async uploadProduct(@Req() req: Request, @Body() body, @UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        this.productsServiceAdmin.checkFilesSize(files);

        body.available = body.available === "true";

        await this.productsServiceAdmin.uploadProduct({ ...body, user_id: req["user"].id }, files);

        res.sendStatus(200);
    }

    @UseGuards(AuthGuard)
    @Get("edit/:id")
    async getEditPage(@Param("id", new ParseIntPipe()) id: number, @Req() req: Request, @Res() res: Response) {
        const product = await this.productsService.getProductAndImageByProductId(id);
        const translateTitle = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en");
        const translateDescription = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_description_" + product.id, "en");
        const rubricTypes = await this.rubricsServiceDb.getRubricsWithTypesByRubricId(product.rubric_id);
        const rubrics = await this.rubricsServiceDb.getAllRubrics();

        res.render("admin/products/product", {
            admin: true,
            auth: true,
            product: product,
            translateTitle: translateTitle ? translateTitle.value : "",
            translateDescription: translateDescription ? translateDescription.value : "",
            rubricTypes: rubricTypes.rubricTypes,
            rubrics: rubrics.filter(el => el.id !== product.rubric_id),
            selectedRubric: rubrics.find(el => el.id === product.rubric_id),
            styles: ["/css/admin/products/upload-product.css"],
            scripts: ["/js/admin/products/edit-product.js"],
            partner: req["user"].role !== "admin"
        });
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    async deleteProductById(@Param("id", new ParseIntPipe()) id: number) {
        await this.productsServiceAdmin.deleteProductById(id);

        return;
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('files', 5, {
        fileFilter(req: any, file: { fieldname: string; originalname: string; encoding: string; mimetype: string; size: number; destination: string; filename: string; path: string; buffer: Buffer }, callback: (error: (Error | null), acceptFile: boolean) => void) {
            if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg" && file.mimetype !== "image/png") {
                callback(new BadRequestException(), false);

                return;
            }
            callback(null, true);
        }
    }))
    @Patch(":id")
    async updateProductById(@Param("id", new ParseIntPipe()) id: number, @Req() req: Request, @UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
        this.productsServiceAdmin.checkFilesSize(files);

        body.available = body.available === "true";
        body.num = Number(body.num);
        body.rubric_id = Number(body.rubric_id);

        await this.productsServiceAdmin.updateProductById(id, body, files, req["user"].id);

        return;
    }

    @UseGuards(AuthGuard)
    @Get("by-filters")
    async getProductsByFilters(
      @Query("available") available: string,
      @Query("priceFrom") priceFrom: string,
      @Query("priceTo") priceTo: string,
      @Query("rubricId") rubricId: string,
      @Query("rubricTypeNameId") rubricTypeNameId: string,
      @Req() req: Request
    ) {
        return await this.productsServiceAdmin.getProductsByFiltersAndAdminId(20, 0, Number(priceFrom), Number(priceTo), available, isNaN(Number(rubricId)) ? null : Number(rubricId), isNaN(Number(rubricTypeNameId)) ? null : Number(rubricTypeNameId), req["user"].id);
    }

    @UseGuards(AuthGuard)
    @Get("search-by-name")
    async getProductByName(
      @Req() req: Request,
      @Query("name") name: string,
      @Query("take", new ParseIntPipe()) take: number,
      @Query("skip", new ParseIntPipe()) skip: number,
    ) {
        return await this.productsServiceDb.getProductsAndImagesLikeNameByUserId(take, skip, name, req["user"].id);
    }
}
