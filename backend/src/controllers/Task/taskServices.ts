import { Task } from '../../models/models';
import { Record } from '../Record/record';
import {
  CreateNewTaskType,
  DeleteOrCompleteTaskType,
  GetTasksType,
  GetTaskType,
  SaveNewTaskType,
  UpdateTaskType,
} from './types';

export class TaskServices {
  public static getTask: GetTaskType = async (projectNumber, userId) => {
    return await Task.findOne({
      where: {
        projectNumber,
        UserId: userId,
      },
    });
  };

  public static getTasks: GetTasksType = async (userId, complete) => {
    return await Task.findAll({
      where: { UserId: userId, complete },
      order: [['id', 'DESC']],
    });
  };

  public static createNewTask: CreateNewTaskType = (req) => {
    const record = Record.createRecord(req);
    return {
      ...record,
      dateAssigned: req.body.dateAssigned,
      dueDate: req.body.dueDate,
    };
  };

  public static updateTask: UpdateTaskType = async (req, task, complete) => {
    const updatedTask = TaskServices.createNewTask(req);
    if (complete) {
      updatedTask.complete = true;
    }
    await task.update(updatedTask);
  };

  public static completeTask: DeleteOrCompleteTaskType = async (task) => {
    await task.update({ complete: true });
  };

  public static saveNewTask: SaveNewTaskType = async (req, userId) => {
    const task = TaskServices.createNewTask(req);

    return await Task.create({
      ...task,
      UserId: userId,
    });
  };

  public static deleteTask: DeleteOrCompleteTaskType = async (task) => {
    await task.destroy();
  };
}
