import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Test extends Document {
  @Prop()
  title: string;

  @Prop([
    {
      question: String,
      options: [String],
      correctOption: Number,
    },
  ])
  questions: {
    question: string;
    options: string[];
    correctOption: number;
  }[];

  @Prop({ type: [{ type: 'ObjectId', ref: 'User' }], default: [] })
  completedBy: string[];
}

export const TestSchema = SchemaFactory.createForClass(Test);
