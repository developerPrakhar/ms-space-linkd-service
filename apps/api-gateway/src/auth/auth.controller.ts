import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDTO) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }


}
