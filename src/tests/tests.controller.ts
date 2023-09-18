import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { TestsService } from './tests.service';
import { CreateTestRequestDto } from './dto/request/create-test-request.dto';
import { GetTestResponseDto } from './dto/response/viewer/get-test-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  async findAllTests(): Promise<GetTestResponseDto[]> {
    return this.testsService.findAllTests();
  }

  @UseGuards(JwtAuthGuard)
  @Get('assignedtests')
  async findAssignedTestsUser(@Request() req): Promise<GetTestResponseDto[]> {
    return this.testsService.getAssignedTests(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('completedtests')
  async findCompletedTestsUser(@Request() req): Promise<GetTestResponseDto[]> {
    return this.testsService.getCompletedTests(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findTest(@Param('id') testId: string): Promise<GetTestResponseDto> {
    return this.testsService.findTest(testId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTest(
    @Body() createTestRequest: CreateTestRequestDto,
  ): Promise<GetTestResponseDto> {
    return this.testsService.createTest(createTestRequest);
  }
}
