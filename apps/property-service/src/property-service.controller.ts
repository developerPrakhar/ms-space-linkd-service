import { Controller, Get } from '@nestjs/common';
import { PropertyServiceService } from './property-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PropertyServiceController {
  constructor(
    private readonly propertyServiceService: PropertyServiceService,
  ) {}

  @MessagePattern('getUserById')
  async getUserById(@Payload() userId: number) {
    return this.propertyServiceService.getUserById(userId);
  }
}
