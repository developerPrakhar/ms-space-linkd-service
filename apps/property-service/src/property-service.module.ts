import { Module } from '@nestjs/common';
import { PropertyServiceController } from './property-service.controller';
import { PropertyServiceService } from './property-service.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MYSQLPROVIDER } from './db/mysql.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + '/development.env',
    }),
  ],
  controllers: [PropertyServiceController],
  providers: [
    PropertyServiceService,
    {
      provide: 'AUTH_CLIENT',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { host: 'auth-service.auth-service', port: 3000 }, //for running in docker use auth-service and for running locally use 127.0.0.1
        });
      },
    },
    MYSQLPROVIDER,
  ],
  exports: [PropertyServiceService],
})
export class PropertyServiceModule {}
