import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const logger = new Logger();

  app.enableCors();
  await app.listen(3002);
  logger.localInstance.log(`api-gateway listening on port: 3002 🚀 `);
}
bootstrap();
