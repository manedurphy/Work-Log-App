import { ISecureRequest } from '@overnightjs/jwt';
import { Log } from 'src/models/models';

export type UpdateTaskLogType = (
  req: ISecureRequest,
  log: Log
) => Promise<void>;

export type GetTaskLogType = (
  projectNumber: number,
  taskId: number
) => Promise<Log[]>;

export type GetTaskLogItemType = (id: number) => Promise<Log | null>;

export type CreateTaskLogType = (
  req: ISecureRequest,
  taskId: number,
  complete: boolean
) => Promise<void>;

export type DeleteTaskLogItemType = (log: Log) => Promise<void>;
