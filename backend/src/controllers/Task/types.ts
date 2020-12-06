import { ISecureRequest } from '@overnightjs/jwt';
import { Task } from '../../models/';

export interface RecordType {
  id?: number;
  name: string;
  projectNumber: number;
  hoursAvailableToWork: number;
  hoursWorked: number;
  notes: string | null;
  hoursRemaining: number;
  numberOfReviews: number;
  reviewHours: number;
  hoursRequiredByBim: number;
  complete: boolean;
}

export interface NewTaskType extends RecordType {
  dateAssigned: Date;
  dueDate: Date;
  UserId?: number;
}

export interface NewLogType extends RecordType {
  complete: boolean;
  TaskId?: number;
}

export type GetTaskType = (
  projectNumber: number,
  userId: number
) => Promise<Task | null>;

export type GetTasksType = (
  userId: number,
  complete: boolean
) => Promise<Task[] | null>;

export type CreateNewTaskType = (req: ISecureRequest) => NewTaskType;

export type UpdateTaskType = (
  req: ISecureRequest,
  task: Task,
  complete: boolean
) => Promise<void>;

export type SaveNewTaskType = (
  req: ISecureRequest,
  userId: number
) => Promise<NewTaskType>;

export type DeleteOrCompleteTaskType = (task: Task) => Promise<void>;
