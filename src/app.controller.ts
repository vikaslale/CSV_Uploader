import { Controller, Get} from '@nestjs/common';
import { AppService } from './app.service';
import {  ApiTags } from '@nestjs/swagger';


@Controller()
@ApiTags('AppModule')
@Controller('api/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


}
