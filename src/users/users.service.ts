import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { UsersRepository } from './users.repository';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { User } from './models/User.model';
import { TestsService } from 'src/tests/tests.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly testsService: TestsService,
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

  async assignTestsToUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    const tests = await this.testsService.findAllTests();

    const completedTests = user.completedTests.map((test) => test.toString());
    const assignedTestsOld = user.assignedTests.map((test) => test.toString());

    const assignedTests = tests
      .filter(
        (test) =>
          !completedTests.includes(test._id.toString()) ||
          !assignedTestsOld.includes(test._id.toString()),
      )
      .map((test) => test._id.toString());

    const newUserData = {
      ...user,
      assignedTests,
    };

    await this.usersRepository.findOneAndEditById(userId, newUserData);
  }

  private buildResponse(user: User): GetUserResponseDto {
    return {
      _id: user._id.toHexString(),
      username: user.username,
      assignedTests: user.assignedTests,
      completedTests: user.completedTests,
    };
  }
}
