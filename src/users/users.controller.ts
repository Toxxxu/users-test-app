import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUserTestResultDto } from 'src/tests/dto/response/completed/get-user-test-result.dto';
import { DoTestRequestDto } from 'src/tests/dto/request/do-test-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserRequest: CreateUserRequestDto,
  ): Promise<GetUserResponseDto> {
    return this.usersService.createUser(createUserRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    await this.usersService.assignTestsToUser(req.user._id);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('do/:testId')
  async doTestById(
    @Request() req,
    @Param('testId') testId: string,
    @Body() doTestRequest: DoTestRequestDto[],
  ): Promise<GetUserTestResultDto> {
    const userId = req.user._id;
    return this.usersService.calculateMarksAndFetchQuestions(
      userId,
      testId,
      doTestRequest,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getTestResult/:testId')
  async getTestResult(
    @Request() req,
    @Param('testId') testId: string,
  ): Promise<GetUserTestResultDto> {
    const userId = req.user._id;
    return this.usersService.getTestCompletedById(userId, testId);
  }
}
