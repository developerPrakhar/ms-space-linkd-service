import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('/health')
  getHealth() {
    console.log('🚀 ~ AppController ~ getHealth method invoked');
    return this.apiGatewayService.health();
  }
}
