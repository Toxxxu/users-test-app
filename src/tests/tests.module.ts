import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { Test, TestSchema } from './models/Test.model';
import { TestsRepository } from './tests.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService, TestsRepository],
  exports: [TestsService],
})
export class TestsModule {}
