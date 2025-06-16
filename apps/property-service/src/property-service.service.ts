import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PropertyServiceService {
  private readonly logger = new Logger(PropertyServiceService.name);

  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  async getUserById(id: number) {
    this.logger.log(
      `🚀 ~ PropertyServiceService ~ getUserById Method invoked with id: ${id}`,
    );
    const resp = await lastValueFrom(this.authClient.send('getUserById', id));
    if (!resp.ok) {
      return { ok: false, message: resp.message, status: resp.status || 500 };
    }
    return { ok: resp.ok, message: resp.message, user: resp.user };
  }
}
