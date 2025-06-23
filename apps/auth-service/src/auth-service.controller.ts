import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { responseService } from 'utils/formatResponse';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern('signup')
  async signup(@Payload() dto: SignupDTO) {
    try {
      const resp = await this.authServiceService.signup(dto);
      return {
        ok: true,
        message: 'User signup sucessfully',
        resp,
      };
    } catch (err) {
      console.error('AuthServiceController signup error', err);
      return {
        ok: false,
        message: err?.message || 'Error signup',
        status: err?.status || 500,
      };
    }
  }

  @MessagePattern('login')
  async login(@Payload() dto: LoginDTO) {
    try {
      const resp = await this.authServiceService.login(dto);
      return {
        ok: true,
        message: 'User logged in sucessfully',
        resp,
      };
    } catch (err) {
      console.error('AuthServiceController login error', err);
      return {
        ok: false,
        message: err?.message || 'Error logging in user',
        status: err?.status || 500,
      };
    }
  }

  @MessagePattern('getUserByEmail')
  async getUserByEmail(@Payload() email: string) {
    try {
      const resp = await this.authServiceService.getUserByEmail(email);

      return responseService.formatSuccessResponse(
        'User fetched successfully',
        resp,
      );
    } catch (err) {
      console.error('AuthServiceController getUserByEmail error', err);
      return {
        ok: false,
        message: err?.message || 'error fetching user by email',
        status: err?.status || 500,
      };
    }
  }

  @MessagePattern('getUserById')
  async getUserById(@Payload() id: number) {
    try {
      const resp = await this.authServiceService.getUserById(id);
      return {
        ok: true,
        message: 'User fetched sucessfully',
        user: resp,
      };
    } catch (err) {
      console.error('AuthServiceController getUserById error', err);
      return {
        ok: false,
        message: err?.message || 'error fetching user by id',
        status: err?.status || 500,
      };
    }
  }
}
