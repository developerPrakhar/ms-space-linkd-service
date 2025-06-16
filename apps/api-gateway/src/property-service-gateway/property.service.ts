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

@Injectable()
export class PropertyService implements OnModuleInit {
  private readonly logger = new Logger(PropertyService.name);

  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3001 },
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
}
