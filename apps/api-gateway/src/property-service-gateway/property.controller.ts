import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: number) {
    return this.propertyService.getUserById(id);
  }
}
