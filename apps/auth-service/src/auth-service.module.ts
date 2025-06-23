import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { ConfigModule } from '@nestjs/config';
import { MYSQLPROVIDER } from './db/mysql.provider';
import { QueryBuilder } from 'utils/queryBuilder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + '/development.env',
    }),
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, MYSQLPROVIDER, QueryBuilder],
  exports: [AuthServiceService],
})
export class AuthServiceModule {}
