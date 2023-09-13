import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './models/Test.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
