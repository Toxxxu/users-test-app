import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema()
export class TestCompletion extends Document {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  userId: string;

  @Prop({ type: 'ObjectId', ref: 'Test', required: true })
  testId: string;

  @Prop({ type: Number, required: true })
  mark: number;

  @Prop([
    {
      question: String,
      status: String,
      correctOption: Number,
      chosenOption: Number,
    },
  ])
  questions: {
    question: string;
    status: string;
    correctOption: number;
    chosenOption: number;
  }[];
}

export const TestCompletionSchema =
  SchemaFactory.createForClass(TestCompletion);
