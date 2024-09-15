import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import { DocksController } from './api/docks/docks.controller';

@Module({
  imports: [],
  controllers: [AppController, ApiController, DocksController],
  providers: [AppService],
})
export class AppModule {}
