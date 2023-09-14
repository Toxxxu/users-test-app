import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { GetUserResponseDto } from 'src/users/dto/response/get-user-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<GetUserResponseDto> {
    return this.usersService.validateUser(username, password);
  }
}
