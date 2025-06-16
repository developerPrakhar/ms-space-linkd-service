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
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { catchError } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3000 },
    });
  }

  async signup(dto: SignupDTO) {
    this.logger.log(
      `🚀 ~ API Gateway AuthService ~ signup Method invoked with email: ${dto.email}, password: ${dto.password} and name: ${dto.name}`,
    );
    const resp = await lastValueFrom(this.client.send('signup', dto));
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.BAD_REQUEST,
      );
    }
    return resp;
  }

  async login(dto: LoginDTO) {
    this.logger.log(
      `🚀 ~ API Gateway AuthService ~ login Method invoked with email: ${dto.email}, password: ${dto.password} `,
    );

    const resp = await lastValueFrom(this.client.send('login', dto));
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.UNAUTHORIZED,
      );
    }
    return resp;
  }
}
