import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        let queryString = "?";

        for(const key in request.query) {
            queryString += key + "=" + request.query[key];
        }
        if(status === 401) {
            response.redirect("/support/auth/" + queryString);
        } else {
            const errorResponse = exception.getResponse();

            if(Array.isArray(errorResponse['message'])) {
                response
                    .status(status)
                    .json({ message: errorResponse['message'][0] });
            } else {
                response
                    .status(status)
                    .json(errorResponse);
            }
        }
    }
}
