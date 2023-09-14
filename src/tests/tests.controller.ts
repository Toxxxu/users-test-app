import { Body, Controller, Get, Post } from '@nestjs/common';

import { TestsService } from './tests.service';
import { CreateTestRequestDto } from './dto/request/create-test-request.dto';
import { GetTestResponseDto } from './dto/response/viewer/get-test-response.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  async findAllTests(): Promise<GetTestResponseDto[]> {
    return this.testsService.findAllTests();
  }

  @Post()
  async createTest(
    @Body() createTestRequest: CreateTestRequestDto,
  ): Promise<GetTestResponseDto> {
    return this.testsService.createTest(createTestRequest);
  }
}
