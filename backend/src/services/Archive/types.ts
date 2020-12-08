import { Task } from 'src/models/models';

export type GetCompletedTasksType = (
  userId: number,
  complete: boolean
) => Promise<Task[]>;
