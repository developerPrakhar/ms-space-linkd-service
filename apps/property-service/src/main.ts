import { NestFactory } from '@nestjs/core';
import { PropertyServiceModule } from './property-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PropertyServiceModule,
    { transport: Transport.TCP, options: { host: '127.0.0.1', port: 3001 } },
  );

  await app.listen();
  logger.localInstance.log(`property-service listening on port: 3001 🚀 `);
}
bootstrap();
