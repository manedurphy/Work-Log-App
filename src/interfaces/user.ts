import { Document } from 'mongoose';
import { ITask } from './task';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: ITask[];
}
