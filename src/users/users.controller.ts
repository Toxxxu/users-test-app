import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserRequest: CreateUserRequestDto,
  ): Promise<GetUserResponseDto> {
    return this.usersService.createUser(createUserRequest);
  }
}
