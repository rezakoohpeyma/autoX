import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './config/env.validation';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    validationSchema: envValidation,
  })],
})
export class AppModule {}
