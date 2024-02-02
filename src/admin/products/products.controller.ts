import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get, Param, ParseIntPipe, Patch,
    Post, Req,
    Res,
    UploadedFiles, UseFilters,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { Response, Request } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {FilesInterceptor} from "@nestjs/platform-express";
import {ProductsService} from "../../products/service/products.service";
import {ProductsServiceDb} from "../../../db/products/products.service";
import {HttpExceptionFilter} from "../../../error-filters/error-filter-admin";
import { translateTypeProduct } from "../../../constants";
import { TranslateServiceDb } from "../../../db/translate/translate.service";
import { ProductsServiceAdmin } from "./service/products.service";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ProductsController {
    constructor(
        private productsService: ProductsService,
        private productsServiceDb: ProductsServiceDb,
        private translateServiceDb: TranslateServiceDb,
        private productsServiceAdmin: ProductsServiceAdmin
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async getProductsPage(@Req() req: Request, @Res() res: Response) {
        const productsAndImages = await this.productsServiceAdmin.getProductsAndImagesByUserId(8, 0, req["user"].id);
        const parseProductsAndImages = this.productsService.parseProductsForLoadCards(productsAndImages, "");

        const countProducts = await this.productsServiceDb.getCountProductsByUserId(req["user"].id);
        const countAvailableProducts = await this.productsServiceDb.getCountAvailableProductsByUserId(req["user"].id);

        const minProductsPrice = await this.productsServiceDb.getMinPriceProductsByUserId(req["user"].id);
        const maxProductsPrice = await this.productsServiceDb.getMaxPriceProductsByUserId(req["user"].id);

        const arrFiltersType = [];

        for(let key in translateTypeProduct) {
            arrFiltersType.push({ name: translateTypeProduct[key], value: key });
        }
        res.render("admin/products/products", {
            auth: true,
            admin: true,
            products: parseProductsAndImages,
            countProducts: countProducts,
            countAvailableProducts: countAvailableProducts,
            styles: ["/css/admin/products/products.css"],
            scripts: ["/js/admin/products/products.js", "/js/admin/products/load-more-products.js"],
            filtersType: arrFiltersType,
            minProductsPrice: minProductsPrice,
            maxProductsPrice: maxProductsPrice
        });
    }

    @UseGuards(AuthGuard)
    @Get("upload-product")
    getUploadProductPage(@Res() res: Response) {
        res.render("admin/products/upload-product", {
            auth: true,
            admin: true,
            styles: ["/css/admin/products/upload-product.css"],
            scripts: ["/js/admin/products/upload-product.js"]
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
    async uploadProduct(@Body() body, @UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        body.available = body.available === "true" ? true : false;

        await this.productsService.uploadProduct(body, files);

        res.sendStatus(200);
    }

    @UseGuards(AuthGuard)
    @Get("edit/:id")
    async getEditPage(@Param("id", new ParseIntPipe()) id: number, @Res() res: Response) {
        const product = await this.productsService.getProductAndImageByProductId(id);
        const translateTitle = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_" + product.id, "en");
        const translateDescription = await this.translateServiceDb.getTranslateByKeyAndIsoCode("product_translate_description_" + product.id, "en");

        res.render("admin/products/product", {
            admin: true,
            auth: true,
            product: product,
            translateTitle: translateTitle ? translateTitle.value : "",
            translateDescription: translateDescription ? translateDescription.value : "",
            styles: ["/css/admin/products/upload-product.css"],
            scripts: ["/js/admin/products/edit-product.js"]
        });
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    async deleteProductById(@Param("id", new ParseIntPipe()) id: number) {
        await this.productsService.deleteProductById(id);

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
        body.available = body.available === "true" ? true : false;
        body.num = Number(body.num);

        await this.productsService.updateProductById(id, body, files, req["user"].id);

        return;
    }
}
