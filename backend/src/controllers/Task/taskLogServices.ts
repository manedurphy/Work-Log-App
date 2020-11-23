import { Log } from '../../models/models';
import { TaskServices } from './taskServices';
import {
  CreateTaskLogType,
  GetTaskLogType,
  GetTaskLogItemType,
  DeleteTaskLogItemType,
} from './types';

export class TaskLogServices {
  public static getTaskLog: GetTaskLogType = async (projectNumber, taskId) => {
    return await Log.findAll({
      where: { projectNumber, TaskId: taskId },
      order: [['id', 'DESC']],
    });
  };

  public static getTaskLogItem: GetTaskLogItemType = async (id) => {
    return await Log.findOne({ where: { id } });
  };

  public static createTaskLog: CreateTaskLogType = async (req, taskId) => {
    const log = TaskServices.createNewTask(req);
    await Log.create({
      ...log,
      loggedAt: req.body.loggedAt,
      TaskId: taskId,
    });
  };

  public static deleteTaskLogItem: DeleteTaskLogItemType = async (log) => {
    await log.destroy();
  };
}
