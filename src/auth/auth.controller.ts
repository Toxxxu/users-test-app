import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserRequestDto } from 'src/users/dto/request/login-user-request.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginUserRequest: LoginUserRequestDto,
  ): Promise<GetUserResponseDto> {
    return this.authService.login(loginUserRequest);
  }
}
