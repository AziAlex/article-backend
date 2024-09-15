import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  getHello(): string {
    return 'Hello from API!';
  }
}
