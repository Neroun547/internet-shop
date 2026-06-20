import { BadRequestException, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

export class UploadProductBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        
        if(!req.body.name || req.body.name.length > 50 || req.body.name.length < 1) {
            throw new BadRequestException({ message: "Невіладна назва. Назва має бути від 1 до 50 символів" });
        }
        if(req.body.description && req.body.description.length > 1000) {
            throw new BadRequestException({ message: "Невалідний опис. Опис має бути до 1000 символів" });
        }
        if(req.body.num && isNaN(Number(req.body.num))) {
            throw new BadRequestException({ message: "Невалідний порядковий номер товару." })
        }
        if(!req.body.price || isNaN(Number(req.body.price))) {
            throw new BadRequestException({ message: "Невалідна ціна товару." });
        }
        if(!req.body.type) {
            throw new BadRequestException({ message: "Невалідний тип товару." })
        }
        if(!req.body.available || (req.body.available !== "true" && req.body.available !== "false")) {
            throw new BadRequestException({ message: "Невалідний тип доступності товару." })
        }
        if(!req.body.rubric_id || isNaN(Number(req.body.rubric_id))) {
            throw new BadRequestException({ message: "Невалідни рубрика товару." });
        }
        req.body = {
            name: req.body.name,
            description: req.body.description,
            num: Number(req.body.num),
            price: Number(req.body.price),
            type: req.body.type,
            available: req.body.available === "true",
            rubric_id: req.body.rubric_id
        };
        return next.handle();
    }

}

