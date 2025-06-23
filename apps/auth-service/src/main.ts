import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AuthServiceModule);
  const logger = new Logger();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    { transport: Transport.TCP, options: { host: '0.0.0.0', port: 3000 } },
  );

  await app.listen();
  logger.localInstance.log(`auth-service listening on port: 3000 🚀 `);
}
bootstrap();
