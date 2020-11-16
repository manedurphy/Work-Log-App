import { ISecureRequest } from '@overnightjs/jwt';
import { Task } from '../../models/models';

export class TaskServices {
  public static async getTask(projectNumber: number, userId: number) {
    return await Task.findOne({
      where: {
        projectNumber,
        UserId: userId,
      },
    });
  }

  public static async getTasks(userId: number, complete: boolean) {
    return await Task.findAll({
      where: { UserId: userId, complete },
    });
  }

  public static createNewTask(req: ISecureRequest) {
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
  }

  public static async updateTask(
    req: ISecureRequest,
    task: any,
    complete: boolean
  ): Promise<void> {
    if (complete) {
      await task.update({ complete: req.body.complete });
    } else {
      const updatedTask = this.createNewTask(req);
      await task.update(updatedTask);
    }
  }

  public static async saveNewTask(req: ISecureRequest, userId: number) {
    const task = this.createNewTask(req);
    return await Task.create({
      ...task,
      UserId: userId,
    });
  }
}
