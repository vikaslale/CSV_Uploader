"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const csv_service_1 = require("./csv.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const rxjs_1 = require("rxjs");
let CsvController = class CsvController {
    constructor(CsvService) {
        this.CsvService = CsvService;
    }
    async uploadFile(file) {
        try {
            return this.CsvService.uploadFiles(file);
        }
        catch (error) {
            const a = {
                err: error.toString()
            };
            throw new common_1.InternalServerErrorException();
        }
    }
    async getDataSearch() {
        try {
            return this.CsvService.getSearchData();
        }
        catch (error) {
            const a = {
                err: error.toString()
            };
            if (error instanceof rxjs_1.NotFoundError) {
                throw new common_1.UnauthorizedException('data not found');
            }
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException({ status_code: 400, message: error.message });
            }
        }
    }
};
exports.CsvController = CsvController;
__decorate([
    (0, common_1.Post)('/upload-singlefiles'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            properties: {
                status_code: { type: 'int', default: 200 },
                error: { type: 'null', default: null },
                message: { type: 'string', default: 'File uploaded successfully' },
                data: {
                    type: 'object',
                    default: {},
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        schema: {
            properties: {
                status_code: { type: 'int', default: 400 },
                error: { type: 'string', default: 'Bad Request' },
                message: { type: 'string', default: 'Only CSV files are allowed!' },
                data: { type: 'object', default: {} },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        schema: {
            properties: {
                status_code: { type: 'int', default: 500 },
                error: { type: 'string', default: 'Internal Server Error' },
                message: { type: 'string', default: 'Internal Server Error' },
                data: { type: 'object', default: {} },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('files', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const name = path.basename(file.originalname, ext);
                cb(null, `${name}-${Date.now()}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CsvController.prototype, "uploadFile", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            properties: {
                status_code: { type: "int", default: "200" },
                error: {},
                message: { type: "string", default: "" },
                data: {
                    type: "object",
                    default: {
                        sucess: "",
                        code: "",
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        schema: {
            properties: {
                status_code: { type: "int", default: "400" },
                error: { type: "string", default: "Bad Request" },
                message: { type: "string", default: "Bad Request" },
                data: { type: "object", default: {} },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        schema: {
            properties: {
                status_code: { type: "int", default: "500" },
                error: { type: "string", default: "Internal Server Error" },
                message: { type: "string", default: "Internal Server Error" },
                data: { type: "object", default: {} },
            },
        },
    }),
    (0, common_1.Get)('data-search'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CsvController.prototype, "getDataSearch", null);
exports.CsvController = CsvController = __decorate([
    (0, swagger_1.ApiTags)('CsvModule'),
    (0, common_1.Controller)('api/csv'),
    __metadata("design:paramtypes", [csv_service_1.CsvService])
], CsvController);
//# sourceMappingURL=csv.controller.js.map