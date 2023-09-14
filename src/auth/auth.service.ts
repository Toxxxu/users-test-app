import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginUserRequestDto } from 'src/users/dto/request/login-user-request.dto';
import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './interfaces/token-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(
    loginUserRequest: LoginUserRequestDto,
  ): Promise<GetUserResponseDto> {
    const { username, password } = loginUserRequest;

    const user = await this.usersService.validateUser(username, password);

    const accessToken = await this.generateAccessToken(user);

    return {
      ...user,
      access_token: accessToken,
    };
  }

  async generateAccessToken(user: GetUserResponseDto): Promise<string> {
    const payload: TokenPayload = {
      userId: user._id,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
