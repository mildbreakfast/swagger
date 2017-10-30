import { INestApplication } from '@nestjs/common';
import { SwaggerBaseConfig, SwaggerDocument } from './interfaces';
export declare class SwaggerModule {
    private static readonly swaggerScanner;
    static createDocument(app: INestApplication, config: SwaggerBaseConfig): SwaggerDocument;
}
