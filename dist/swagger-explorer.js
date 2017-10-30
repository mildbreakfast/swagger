"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@nestjs/common/constants");
const api_bearer_explorer_1 = require("./explorers/api-bearer.explorer");
const api_consumes_explorer_1 = require("./explorers/api-consumes.explorer");
const api_produces_explorer_1 = require("./explorers/api-produces.explorer");
const api_response_explorer_1 = require("./explorers/api-response.explorer");
const api_use_tags_explorer_1 = require("./explorers/api-use-tags.explorer");
const lodash_1 = require("lodash");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const common_1 = require("@nestjs/common");
const api_operation_explorer_1 = require("./explorers/api-operation.explorer");
const api_parameters_explorer_1 = require("./explorers/api-parameters.explorer");
class SwaggerExplorer {
    constructor() {
        this.metadataScanner = new metadata_scanner_1.MetadataScanner();
        this.modelsDefinitions = [];
    }
    exploreController({ instance, metatype }) {
        const prototype = Object.getPrototypeOf(instance);
        const explorersSchema = {
            root: [
                this.exploreRoutePathAndMethod,
                api_operation_explorer_1.exploreApiOperationMetadata,
                api_parameters_explorer_1.exploreApiParametersMetadata.bind(null, this.modelsDefinitions),
            ],
            produces: [api_produces_explorer_1.exploreApiProducesMetadata],
            consumes: [api_consumes_explorer_1.exploreApiConsumesMetadata],
            security: [api_bearer_explorer_1.exploreApiBearerMetadata],
            tags: [api_use_tags_explorer_1.exploreApiUseTagsMetadata],
            responses: [api_response_explorer_1.exploreApiResponseMetadata.bind(null, this.modelsDefinitions)],
        };
        return this.generateDenormalizedDocument(metatype, prototype, instance, explorersSchema);
    }
    getModelsDefinitons() {
        return this.modelsDefinitions;
    }
    generateDenormalizedDocument(metatype, prototype, instance, explorersSchema) {
        const path = this.validateRoutePath(this.reflectControllerPath(metatype));
        const self = this;
        const globalMetadata = this.exploreGlobalMetadata(metatype);
        const denormalizedPaths = this.metadataScanner.scanFromPrototype(instance, prototype, (name) => {
            const targetCallback = prototype[name];
            const methodMetadata = lodash_1.mapValues(explorersSchema, (explorers) => explorers.reduce((metadata, fn) => {
                const exploredMetadata = fn.call(self, instance, prototype, targetCallback, path);
                if (!exploredMetadata) {
                    return metadata;
                }
                if (!lodash_1.isArray(exploredMetadata)) {
                    return Object.assign({}, metadata, exploredMetadata);
                }
                return lodash_1.isArray(metadata) ? [...metadata, ...exploredMetadata] : exploredMetadata;
            }, {}));
            return Object.assign({ responses: {} }, globalMetadata, lodash_1.omitBy(methodMetadata, lodash_1.isEmpty));
        });
        return denormalizedPaths;
    }
    exploreGlobalMetadata(metatype) {
        const globalExplorers = [
            api_produces_explorer_1.exploreGlobalApiProducesMetadata,
            api_use_tags_explorer_1.exploreGlobalApiUseTagsMetadata,
            api_consumes_explorer_1.exploreGlobalApiConsumesMetadata,
            api_bearer_explorer_1.exploreGlobalApiBearerMetadata,
            api_response_explorer_1.exploreGlobalApiResponseMetadata.bind(null, this.modelsDefinitions),
        ];
        const globalMetadata = (globalExplorers.map((explorer) => explorer.call(explorer, metatype)).filter((val) => !shared_utils_1.isUndefined(val))).reduce((curr, next) => (Object.assign({}, curr, next)), {});
        return globalMetadata;
    }
    exploreRoutePathAndMethod(instance, prototype, method, globalPath) {
        const routePath = Reflect.getMetadata(constants_1.PATH_METADATA, method);
        if (shared_utils_1.isUndefined(routePath)) {
            return undefined;
        }
        const requestMethod = Reflect.getMetadata(constants_1.METHOD_METADATA, method);
        return {
            method: common_1.RequestMethod[requestMethod].toLowerCase(),
            path: globalPath + this.validateRoutePath(routePath),
        };
    }
    reflectControllerPath(metatype) {
        const path = Reflect.getMetadata(constants_1.PATH_METADATA, metatype);
        return this.validateRoutePath(path);
    }
    validateRoutePath(path) {
        if (shared_utils_1.isUndefined(path)) {
            return '';
        }
        const pathWithParams = path.replace(/([:].*?[^\/]*)/g, (str) => {
            return `{${str.slice(1, str.length)}}`;
        });
        return pathWithParams === '/' ? '' : shared_utils_1.validatePath(pathWithParams);
    }
}
exports.SwaggerExplorer = SwaggerExplorer;
