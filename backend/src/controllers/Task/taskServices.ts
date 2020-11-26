import { Task } from '../../models/models';
import { Record } from '../Record/record';
import {
  CreateNewTaskType,
  DeleteTaskType,
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
    if (complete) {
      await task.update({ complete: req.body.complete });
    } else {
      const updatedTask = TaskServices.createNewTask(req);
      await task.update(updatedTask);
    }
  };

  public static saveNewTask: SaveNewTaskType = async (req, userId) => {
    const task = TaskServices.createNewTask(req);

    return await Task.create({
      ...task,
      UserId: userId,
    });
  };

  public static deleteTask: DeleteTaskType = async (task) => {
    await task.destroy();
  };
}
