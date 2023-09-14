import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Test } from './models/Test.model';

@Injectable()
export class TestsRepository {
  constructor(
    @InjectModel(Test.name)
    private readonly test: Model<Test>,
  ) {}

  async findAll(): Promise<Test[]> {
    return this.test.find();
  }

  async insertOne(data: Partial<Test>): Promise<Test> {
    const test = new this.test(data);
    return test.save();
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
