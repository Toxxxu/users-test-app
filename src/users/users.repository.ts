import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './models/User.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly user: Model<User>,
  ) {}

  async insertOne(data: Partial<User>): Promise<User> {
    const user = new this.user(data);
    return user.save();
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.user.findOne({ username });
  }

  async findOneById(userId: string): Promise<User> {
    return this.user.findById(userId);
  }
}