import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { UsersRepository } from './users.repository';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { User } from './models/User.model';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createUser(
    createUserRequest: CreateUserRequestDto,
  ): Promise<GetUserResponseDto> {
    await this.validateCreateUserRequest(createUserRequest);
    const user = await this.usersRepository.insertOne({
      ...createUserRequest,
      password: await hash(createUserRequest.password, 10),
    });
    return this.buildResponse(user);
  }

  private async validateCreateUserRequest(
    createUserRequest: CreateUserRequestDto,
  ): Promise<void> {
    const user = await this.usersRepository.findOneByUsername(
      createUserRequest.username,
    );
    if (user) {
      throw new BadRequestException('This email already exists.');
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<GetUserResponseDto> {
    const user = await this.usersRepository.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(
        `User does not exist by username '${username}'.`,
      );
    }
    const passwordIsValid = await compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are invalid');
    }
    return this.buildResponse(user);
  }

  async getUserById(userId: string): Promise<GetUserResponseDto> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User not found by _id: '${userId}'.`);
    }
    return this.buildResponse(user);
  }

  private buildResponse(user: User): GetUserResponseDto {
    return {
      _id: user._id.toHexString(),
      username: user.username,
      access_token: user.access_token,
      assignedTests: user.assignedTests,
      completedTests: user.completedTests,
    };
  }
}
