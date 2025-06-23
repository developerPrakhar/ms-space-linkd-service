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

  // // for running locally
  // onModuleInit() {
  //   this.client = ClientProxyFactory.create({
  //     transport: Transport.TCP,
  //     options: { host: '127.0.0.1', port: 3000 },
  //   });
  // }

  // for running inside docker
  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'auth-service.auth-service', port: 3000 },
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
  async getUserByEmail(email: string) {
    this.logger.log(
      `🚀 ~ API Gateway AuthService ~ getUserByEmail Method invoked with email:${email} `,
    );
    const resp = await lastValueFrom(this.client.send('getUserByEmail', email));
    if (!resp.ok) {
      throw new HttpException(
        resp.message,
        resp.status || HttpStatus.BAD_REQUEST,
      );
    }
    return resp;
  }
}
