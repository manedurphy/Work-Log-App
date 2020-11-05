import { Document } from 'mongoose';
import { ITaskModel } from './task';

export interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  password: string;
  tasks: {
    currentTasks: ITaskModel[];
    completedTasks: ITaskModel[];
  };
}
