"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_scanner_1 = require("./swagger-scanner");
class SwaggerModule {
    static createDocument(app, config) {
        const document = this.swaggerScanner.scanApplication(app);
        return Object.assign({}, config, document);
    }
}
SwaggerModule.swaggerScanner = new swagger_scanner_1.SwaggerScanner();
exports.SwaggerModule = SwaggerModule;
