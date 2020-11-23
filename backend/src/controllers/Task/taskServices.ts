import {
  CreateNewTaskType,
  DeleteTaskType,
  GetTasksType,
  GetTaskType,
  SaveNewTaskType,
  UpdateTaskType,
} from './types';
import { Task } from '../../models/models';

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
    const {
      name,
      projectNumber,
      hoursAvailableToWork,
      hoursWorked,
      notes,
      numberOfReviews,
      reviewHours,
      hoursRequiredByBim,
    } = req.body;

    const hoursRemaining =
      +hoursAvailableToWork - +hoursWorked - +reviewHours - +hoursRequiredByBim;

    return {
      name,
      projectNumber: +projectNumber,
      hoursAvailableToWork: +hoursAvailableToWork,
      hoursWorked: +hoursWorked,
      notes,
      hoursRemaining,
      numberOfReviews: +numberOfReviews,
      reviewHours: +reviewHours,
      hoursRequiredByBim: +hoursRequiredByBim,
      complete: false,
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
      dateAssigned: req.body.dateAssigned,
      dueDate: req.body.dueDate,
      UserId: userId,
    });
  };

  public static deleteTask: DeleteTaskType = async (task) => {
    await task.destroy();
  };
}
