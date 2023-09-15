import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { UsersRepository } from './users.repository';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { User } from './models/User.model';
import { TestsService } from 'src/tests/tests.service';
import { DoTestRequestDto } from 'src/tests/dto/request/do-test-request.dto';
import { GetUserTestResultDto } from 'src/tests/dto/response/completed/get-user-test-result.dto';
import { ReceiveTestDto } from 'src/tests/dto/response/completed/receive-test.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => TestsService))
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

  async validateUserTests(userId: string, testId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user.completedTests.includes(testId)) {
      throw new NotAcceptableException(
        `User already completed this test by _id: '${testId}'.`,
      );
    }
  }

  async assignTestsToUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    const tests = await this.testsService.findAllTests();
    const completedTests = user.completedTests.map((test) => test.toString());
    const assignedTestsOld = user.assignedTests.map((test) => test.toString());

    const assignedTests = tests
      .filter(
        (test) =>
          !completedTests.includes(test._id.toString()) &&
          !assignedTestsOld.includes(test._id.toString()), // Check if not already assigned
      )
      .map((test) => test._id.toString());

    const newUserData = {
      ...user,
      assignedTests,
    };

    await this.usersRepository.findOneAndEditById(userId, newUserData);
  }

  async completeTest(userId: string, testId: string): Promise<void> {
    const user = await this.getUserById(userId);

    user.completedTests.push(testId);

    const updatedAssignedTests = user.assignedTests.filter(
      (assignedTestId) => assignedTestId !== testId,
    );

    const newData = {
      ...user,
      assignedTests: updatedAssignedTests,
    };

    await this.usersRepository.findOneAndEditById(userId, newData);
  }

  async getTestCompletedById(
    userId: string,
    testId: string,
  ): Promise<GetUserTestResultDto> {
    const test = await this.testsService.getTestCompletedById(userId, testId);
    return this.buildResponseCompletedTest(test, userId, testId);
  }

  async calculateMarksAndFetchQuestions(
    userId: string,
    testId: string,
    checkTest: DoTestRequestDto[],
  ): Promise<GetUserTestResultDto> {
    await this.validateUserTests(userId, testId);
    const user = await this.getUserById(userId);
    const test = await this.testsService.findTest(testId);

    const { mark, questions } = this.testsService.calculateMark(
      test,
      checkTest,
    );
    await this.completeTest(userId, testId);
    await this.testsService.addUsersCompleted(userId, testId);
    await this.testsService.addTestCompletion({
      userId,
      testId,
      mark,
      questions,
    });

    return {
      username: user.username,
      title: test.title,
      mark,
      questions,
    };
  }

  private buildResponse(user: User): GetUserResponseDto {
    return {
      _id: user._id.toHexString(),
      username: user.username,
      assignedTests: user.assignedTests,
      completedTests: user.completedTests,
    };
  }

  private async buildResponseCompletedTest(
    test: ReceiveTestDto,
    userId: string,
    testId: string,
  ): Promise<GetUserTestResultDto> {
    const user = await this.getUserById(userId);
    const testById = await this.testsService.findTest(testId);
    return {
      username: user.username,
      title: testById.title,
      mark: test.mark,
      questions: test.questions,
    };
  }
}
