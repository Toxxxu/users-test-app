import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserRequestDto } from 'src/users/dto/request/login-user-request.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginUserRequest: LoginUserRequestDto,
  ): Promise<GetUserResponseDto> {
    return this.authService.login(loginUserRequest);
  }
}
