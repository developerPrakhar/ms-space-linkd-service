import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDTO } from './dto/createProperty.dto';


@Controller('property')
export class PropertyController {
 constructor(private readonly propertyService: PropertyService) {}


 @Get('user/:id')
 async getUserById(@Param('id') id: number) {
   return this.propertyService.getUserById(id);
 }


 @Post('create')
 async createProperty(@Body() dto: CreatePropertyDTO) {
   return this.propertyService.createProperty(dto);
 }

 @Get('getAllProperties')
 async getAllProperties() {
   return this.propertyService.getAllProperties();
 }
 @Get('get/:id')
 async getPropertyById(@Param('id') id: number) {
   return this.propertyService.getPropertyById(id);
 }


}



