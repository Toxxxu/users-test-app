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

  async insertOne(data: Partial<Test>): Promise<Test> {
    const test = new this.test(data);
    return test.save();
  }

  async findOneAndEditById(
    testId: string,
    newData: Partial<Test>,
  ): Promise<Test> {
    const updatedTest = await this.test.findByIdAndUpdate(testId, newData, {
      new: true,
    });
    return updatedTest;
  }

  async findOneAndEditByTitle(
    title: string,
    newData: Partial<Test>,
  ): Promise<Test> {
    const updatedTest = await this.test.findOneAndUpdate({ title }, newData, {
      new: true,
    });
    return updatedTest;
  }
}
