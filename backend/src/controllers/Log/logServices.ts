import { Log, Task } from '../../models/models';
import { Record } from '../Record/record';
import { UpdateTaskLogType } from './types';
import {
  CreateTaskLogType,
  GetTaskLogItemType,
  DeleteTaskLogItemType,
  GetTaskLogType,
  UpdateCompleteStatusType,
} from './types';

export class LogServices {
  public static getLog: GetTaskLogType = async (projectNumber, taskId) => {
    return await Log.findAll({
      where: { projectNumber, TaskId: taskId },
      order: [['id', 'DESC']],
    });
  };

  public static getTaskLogItem: GetTaskLogItemType = async (id) => {
    return await Log.findOne({ where: { id } });
  };

  public static createTaskLog: CreateTaskLogType = async (
    req,
    taskId,
    complete
  ) => {
    const log = Record.createRecord(req);
    if (complete) log.complete = true;

    await Log.create({
      ...log,
      loggedAt: req.body.loggedAt || new Date(),
      TaskId: taskId,
    });
  };

  public static updateTaskLog: UpdateTaskLogType = async (req, log) => {
    const updatedLog = Record.createRecord(req);
    await log.update({
      ...updatedLog,
      loggedAt: req.body.loggedAt,
      TaskId: log.TaskId,
    });
  };

  public static updateCompleteStatus: UpdateCompleteStatusType = async (
    log
  ) => {
    await log.update({ complete: true });
  };

  public static deleteTaskLogItem: DeleteTaskLogItemType = async (log) => {
    await log.destroy();
  };
}
