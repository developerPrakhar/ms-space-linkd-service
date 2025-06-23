import { Controller, Get } from '@nestjs/common';
import { PropertyServiceService } from './property-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePropertyDTO } from '../dto/createProperty.dto';

@Controller()
export class PropertyServiceController {
  constructor(
    private readonly propertyServiceService: PropertyServiceService,
  ) {}

  @MessagePattern('getUserById')
  async getUserById(@Payload() userId: number) {
    return this.propertyServiceService.getUserById(userId);
  }

  @MessagePattern('createProperty')
 async createProperty(@Payload() dto: CreatePropertyDTO) {
   try {
     const resp = await this.propertyServiceService.createProperty(dto);
     return {
       ok: true,
       message: 'Property Created successfully',
       data: resp,
     };
   } catch (err) {
     console.error('PropertyServiceController signup error', err);
     return {
       ok: false,
       message: err?.message || 'Error creating property',
       status: err?.status || 500,
     };
   }
 }

 @MessagePattern('getAllProperties')
 async getAllProperties() {
   try {
     const resp = await this.propertyServiceService.getAllProperties();
     return {
       ok: true,
       message: 'Properties fetched successfully',
       data: resp,
     };
   } catch (err) {
     console.error('PropertyServiceController getAllProperties error', err);
     return {
       ok: false,
       message: err?.message || 'Error fetching all properties',
       status: err?.status || 500,
     };
   }
 }

 @MessagePattern('getPropertyById')
 async getPropertyById(@Payload() id: number) {
   try {
     const resp = await this.propertyServiceService.getPropertyById(id);
     return {
       ok: true,
       message: 'Property fetched successfully',
       data: resp,
     };
   } catch (err) {
     console.error('PropertyServiceController signup error', err);
     return {
       ok: false,
       message: err?.message || 'Error fetching property details',
       status: err?.status || 500,
     };
   }
 }


}
