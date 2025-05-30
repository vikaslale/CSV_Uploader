import { Controller, Post, Get, UploadedFile, UseInterceptors,
   UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CsvService } from './csv.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { NotFoundError } from 'rxjs';


@ApiTags('CsvModule')
@Controller('api/csv')
export class CsvController {

  constructor(private CsvService: CsvService) { }

  @Post('/upload-singlefiles')
  @ApiConsumes('multipart/form-data')

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    schema: {
      properties: {
        status_code: { type: 'int', default: 400 },
        error: { type: 'string', default: 'Bad Request' },
        message: { type: 'string', default: 'Only CSV files are allowed!' },
        data: { type: 'object', default: {} },
      },
    },
  })
  @ApiResponse({
    status: 500,
    schema: {
      properties: {
        status_code: { type: 'int', default: 500 },
        error: { type: 'string', default: 'Internal Server Error' },
        message: { type: 'string', default: 'Internal Server Error' },
        data: { type: 'object', default: {} },
      },
    },
  })
  @UseInterceptors(FileInterceptor('files', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
      },
    }),
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File) {
    try {
      return this.CsvService.uploadFiles(file)
    } catch (error) {
      const a = {
        err: error.toString()
      }
      throw new InternalServerErrorException()
    }

  }

  
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    schema: {
      properties: {
        status_code: { type: "int", default: "400" },
        error: { type: "string", default: "Bad Request" },
        message: { type: "string", default: "Bad Request" },
        data: { type: "object", default: {} },
      },
    },
  })

  @ApiResponse({
    status: 500,
    schema: {
      properties: {
        status_code: { type: "int", default: "500" },
        error: { type: "string", default: "Internal Server Error" },
        message: { type: "string", default: "Internal Server Error" },
        data: { type: "object", default: {} },
      },
    },
  })
  @Get('data-search')
  async getDataSearch() {
    try {
       return this.CsvService.getSearchData()
    } catch (error) {
      const a = {
        err: error.toString()
      }
      if (error instanceof NotFoundError) {
        throw new UnauthorizedException('data not found')
      }

      if (error instanceof BadRequestException) {
        throw new BadRequestException({ status_code: 400, message: error.message })
      }
    }
  }
}

