import { Document } from 'mongoose';
import { ITaskModel } from './task';

export interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: {
    currentTasks: ITaskModel[];
    completedTasks: ITaskModel[];
  };
}
