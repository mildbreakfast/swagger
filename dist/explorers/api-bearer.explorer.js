"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.exploreGlobalApiBearerMetadata = (metatype) => {
    const bearer = Reflect.getMetadata(constants_1.DECORATORS.API_BEARER, metatype);
    return bearer ? { security: [{ bearer }] } : undefined;
};
exports.exploreApiBearerMetadata = (instance, prototype, method) => {
    const bearer = Reflect.getMetadata(constants_1.DECORATORS.API_BEARER, method);
    return bearer ? [{ bearer }] : undefined;
};
