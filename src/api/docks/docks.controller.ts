import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('docks')
@Controller('api/docks')
export class DocksController {
  @Get()
  @ApiResponse({ status: 201, description: 'Successful retrieval of docks.' })
  getDocks(): string {
    return 'List of docks';
  }
}
