import { Module } from '@nestjs/common';
import { PropertyServiceController } from './property-service.controller';
import { PropertyServiceService } from './property-service.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  controllers: [PropertyServiceController],
  providers: [
    PropertyServiceService,
    {
      provide: 'AUTH_CLIENT',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { host: '127.0.0.1', port: 3000 },
        });
      },
    },
  ],
})
export class PropertyServiceModule {}
