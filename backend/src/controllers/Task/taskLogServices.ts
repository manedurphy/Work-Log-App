import { ISecureRequest } from '@overnightjs/jwt';
import { LogAttributes } from 'src/interfaces/log';
import { Log } from '../../models/models';
import { TaskServices } from './taskServices';

export class TaskLogServices {
  public static async getTaskLog(
    projectNumber: number,
    taskId: number
  ): Promise<LogAttributes[]> {
    return await Log.findAll({
      where: { projectNumber, TaskId: taskId },
      order: [['id', 'DESC']],
    });
  }

  public static async createTaskLog(
    req: ISecureRequest,
    taskId: number
  ): Promise<void> {
    const log = TaskServices.createNewTask(req);

    await Log.create({
      ...log,
      TaskId: taskId,
    });
  }
}