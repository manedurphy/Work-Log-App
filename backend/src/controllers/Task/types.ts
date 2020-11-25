import { ISecureRequest } from '@overnightjs/jwt';
import { Log, Task } from '../../models/models';

export type NewTaskType = {
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
  dateAssigned?: Date | string;
  dueDate?: Date;
  UserId?: number;
};

export type NewLogType = {
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
  TaskId?: number;
};

export type GetTaskType = (
  projectNumber: number,
  userId: number
) => Promise<Task | null>;

export type GetTasksType = (
  userId: number,
  complete: boolean
) => Promise<Task[]>;

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

export type DeleteTaskType = (task: Task) => Promise<void>;

export type GetTaskLogType = (
  projectNumber: number,
  taskId: number
) => Promise<Log[]>;

export type CreateTaskLogType = (
  req: ISecureRequest,
  taskId: number
) => Promise<void>;

export type GetTaskLogItemType = (id: number) => Promise<Log | null>;

export type DeleteTaskLogItemType = (log: Log) => Promise<void>;
