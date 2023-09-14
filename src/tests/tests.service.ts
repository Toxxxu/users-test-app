import { Injectable, NotFoundException } from '@nestjs/common';

import { TestsRepository } from './tests.repository';
import { CreateTestRequestDto } from './dto/request/create-test-request.dto';
import { GetTestResponseDto } from './dto/response/viewer/get-test-response.dto';
import { Test } from './models/Test.model';
import { DoTestResponseDto } from './dto/response/client/do-test-response.dto';

@Injectable()
export class TestsService {
  constructor(private readonly testsRepository: TestsRepository) {}

  async findAllTests(): Promise<GetTestResponseDto[]> {
    const tests = await this.testsRepository.findAll();
    return tests.map((test) => this.buildResponse(test));
  }

  async findTest(testId: string): Promise<DoTestResponseDto> {
    const test = await this.testsRepository.findOneById(testId);
    if (!test) {
      throw new NotFoundException(`Test not found by _id: '${testId}'.`);
    }
    return this.buildResponse(test);
  }

  async createTest(
    createTestRequest: CreateTestRequestDto,
  ): Promise<GetTestResponseDto> {
    const test = await this.testsRepository.insertOne({
      ...createTestRequest,
    });
    return this.buildResponse(test);
  }

  private buildResponse(test: Test): GetTestResponseDto {
    return {
      _id: test._id.toHexString(),
      title: test.title,
    };
  }
}
