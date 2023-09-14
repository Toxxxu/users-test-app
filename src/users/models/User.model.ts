import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Test' }] })
  assignedTests: string[];

  @Prop({ type: [{ type: 'ObjectId', ref: 'Test' }] })
  completedTests: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
