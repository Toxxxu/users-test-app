import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { Test, TestSchema } from './models/Test.model';
import { TestsRepository } from './tests.repository';
import {
  TestCompletion,
  TestCompletionSchema,
} from './models/Test.completion.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: TestCompletion.name, schema: TestCompletionSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [TestsController],
  providers: [TestsService, TestsRepository],
  exports: [TestsService],
})
export class TestsModule {}
