import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { CreatePropertyDTO } from './dto/createProperty.dto';

@Injectable()
export class PropertyService implements OnModuleInit {
  private readonly logger = new Logger(PropertyService.name);

  private client: ClientProxy;

  // for running locally
  // onModuleInit() {
  //   this.client = ClientProxyFactory.create({
  //     transport: Transport.TCP,
  //     options: { host: '127.0.0.1', port: 3001 },
  //   });
  // }

  // for running inside docker
  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'property-service.property-service', port: 3001 },
    });
  }

  async getUserById(userId: number) {
    this.logger.log(
      `🚀 ~ API Gateway PropertyService ~ getUserById Method invoked with id:${userId} `,
    );
    const resp = await lastValueFrom(this.client.send('getUserById', userId));
    console.log('🚀 ~ PropertyService ~ getUserById ~ resp:', resp);
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.BAD_REQUEST,
      );
    }
    return resp;
  }

  async createProperty(dto: CreatePropertyDTO) {
    this.logger.log(
      `🚀 ~ API Gateway PropertyService ~ createProperty Method invoked with dto:${JSON.stringify(dto)} `,
    );
    const resp = await lastValueFrom(this.client.send('createProperty', dto));
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.BAD_REQUEST,
      );
    }
    return resp;
  }

  async getAllProperties() {
    this.logger.log(
      `🚀 ~ API Gateway PropertyService ~ getAllProperties Method invoked  `,
    );
    const resp = await lastValueFrom(this.client.send('getAllProperties', ''));
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.BAD_REQUEST,
      );
    }
    return resp;
  }

  async getPropertyById(id: number) {
    this.logger.log(
      `🚀 ~ API Gateway PropertyService ~ getPropertyById Method invoked with id: ${id}} `,
    );
    const resp = await lastValueFrom(this.client.send('getPropertyById', id));
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.BAD_REQUEST,
      );
    }
    return resp;
  }
}
