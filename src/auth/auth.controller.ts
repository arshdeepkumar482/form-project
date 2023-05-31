import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin-dto';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @Redirect('/user/signup')
  create() {}

  @Post('signin')
  @Public()
  findOne(@Body() body: SigninDto) {
    return this.authService.signIn(body);
  }
}
