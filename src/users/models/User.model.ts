import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  access_token: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Test' }] })
  assignedTests: string[];

  @Prop({ type: [{ type: 'ObjectId', ref: 'Test' }] })
  completedTests: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
