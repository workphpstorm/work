import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configs from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
