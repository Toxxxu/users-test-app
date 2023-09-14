import { Injectable } from '@nestjs/common';

import { TestsRepository } from './tests.repository';
import { CreateTestRequestDto } from './dto/request/create-test-request.dto';
import { GetTestResponseDto } from './dto/response/get-test-response.dto';
import { Test } from './models/Test.model';

@Injectable()
export class TestsService {
  constructor(private readonly testsRepository: TestsRepository) {}

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
