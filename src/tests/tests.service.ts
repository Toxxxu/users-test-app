import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { TestsRepository } from './tests.repository';
import { CreateTestRequestDto } from './dto/request/create-test-request.dto';
import { GetTestResponseDto } from './dto/response/viewer/get-test-response.dto';
import { Test } from './models/Test.model';
import { UsersService } from 'src/users/users.service';
import { GetMarkResultDto } from './dto/response/completed/get-mark-result.dto';
import { DoTestRequestDto } from './dto/request/do-test-request.dto';
import { TestCompletion } from './models/Test.completion.model';
import { ReceiveTestDto } from './dto/response/completed/receive-test.dto';

@Injectable()
export class TestsService {
  constructor(
    private readonly testsRepository: TestsRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersSerivce: UsersService,
  ) {}

  async findAllTests(): Promise<GetTestResponseDto[]> {
    const tests = await this.testsRepository.findAll();
    return tests.map((test) => this.buildResponseViewer(test));
  }

  async findTest(testId: string): Promise<GetTestResponseDto> {
    const test = await this.testsRepository.findOneById(testId);
    if (!test) {
      throw new NotFoundException(`Test not found by _id: '${testId}'.`);
    }
    return this.buildResponseClient(test);
  }

  async createTest(
    createTestRequest: CreateTestRequestDto,
  ): Promise<GetTestResponseDto> {
    const test = await this.testsRepository.insertOneTest({
      ...createTestRequest,
    });
    return this.buildResponseViewer(test);
  }

  async addUsersCompleted(userId: string, testId: string): Promise<void> {
    const test = await this.findTest(testId);
    test.completedBy.push(userId);
    await this.testsRepository.findOneAndEditById(testId, test);
  }

  async addTestCompletion(data: ReceiveTestDto): Promise<void> {
    await this.testsRepository.insertOneTestCompletion(data);
  }

  async getTestCompletedById(
    userId: string,
    testId: string,
  ): Promise<ReceiveTestDto> {
    const test = await this.testsRepository.findTestCompletedById(
      userId,
      testId,
    );
    return this.buildReceiveTest(test);
  }

  calculateMark(
    test: GetTestResponseDto,
    testCheck: DoTestRequestDto[],
  ): GetMarkResultDto {
    let totalMark = 0;
    const questions = [];

    for (const question of test.questions) {
      const questionName = question.question;
      const correctOption = question.correctOption;

      const userAnswer = testCheck.find(
        (answer) => answer.question === questionName,
      );
      let questionStatus = 'incorrect';
      let questionMark = 0;

      if (userAnswer) {
        const chosenOption = userAnswer.chosenOption;

        if (chosenOption === correctOption) {
          questionStatus = 'correct';
          questionMark = 1;
        }

        totalMark += questionMark;

        questions.push({
          question: questionName,
          status: questionStatus,
          correctOption,
          chosenOption,
        });
      }
    }

    const mark = (totalMark / test.questions.length) * 100;

    return {
      mark,
      questions,
    };
  }

  private buildResponseViewer(test: Test): GetTestResponseDto {
    return {
      _id: test._id.toHexString(),
      title: test.title,
      completedBy: test.completedBy,
    };
  }

  private buildResponseClient(test: Test): GetTestResponseDto {
    return {
      _id: test._id.toHexString(),
      title: test.title,
      questions: test.questions,
      completedBy: test.completedBy,
    };
  }

  private buildReceiveTest(test: TestCompletion): ReceiveTestDto {
    return {
      userId: test.userId,
      testId: test.testId,
      mark: test.mark,
      questions: test.questions,
    };
  }
}
