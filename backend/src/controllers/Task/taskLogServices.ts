import { Log } from '../../models/models';
import { TaskServices } from './taskServices';
import { CreateTaskLogType, GetTaskLogType } from './types';

export class TaskLogServices {
  public static getTaskLog: GetTaskLogType = async (projectNumber, taskId) => {
    return await Log.findAll({
      where: { projectNumber, TaskId: taskId },
      order: [['id', 'DESC']],
    });
  };

  public static createTaskLog: CreateTaskLogType = async (req, taskId) => {
    const log = TaskServices.createNewTask(req);
    await Log.create({
      ...log,
      TaskId: taskId,
    });
  };
}
