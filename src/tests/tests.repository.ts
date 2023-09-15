import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Test } from './models/Test.model';
import { TestCompletion } from './models/Test.completion.model';

@Injectable()
export class TestsRepository {
  constructor(
    @InjectModel(Test.name)
    private readonly test: Model<Test>,
    @InjectModel(TestCompletion.name)
    private readonly testCompletion: Model<TestCompletion>,
  ) {}

  async findAll(): Promise<Test[]> {
    return this.test.find();
  }

  async insertOneTest(data: Partial<Test>): Promise<Test> {
    const test = new this.test(data);
    return test.save();
  }

  async insertOneTestCompletion(
    data: Partial<TestCompletion>,
  ): Promise<TestCompletion> {
    const test = new this.testCompletion(data);
    return test.save();
  }

  async findTestCompletedById(
    userId: string,
    testId: string,
  ): Promise<TestCompletion> {
    const testCompletion = await this.testCompletion.findOne({
      userId,
      testId,
    });

    if (!testCompletion) {
      throw new NotFoundException(
        `Test completion not found for userId: ${userId} and testId: ${testId}`,
      );
    }

    return testCompletion;
  }

  async findOneById(testId: string): Promise<Test> {
    return this.test.findById(testId);
  }

  async findOneAndEditById(
    testId: string,
    newData: Partial<Test>,
  ): Promise<Test> {
    return this.test.findByIdAndUpdate(testId, newData, {
      new: true,
    });
  }
}
