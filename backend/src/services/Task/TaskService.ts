import { ISecureRequest } from '@overnightjs/jwt';
import { Task } from '../../models/models';
import { Record } from '../Record/record';

export class TaskService extends Record {
  private userId: number;
  private projectNumber: number | null;

  constructor(userId: number, projectNumber: number | null = null) {
    super();
    this.userId = userId;
    this.projectNumber = projectNumber;
  }

  public getTask(): Promise<Task | null> {
    return Task.findOne({
      where: {
        projectNumber: this.projectNumber,
        UserId: this.userId,
      },
    });
  }

  public getTasks(complete: boolean): Promise<Task[] | null> {
    return Task.findAll({
      where: { UserId: this.userId, complete },
      order: [['id', 'DESC']],
    });
  }

  public create(req: ISecureRequest) {
    const record = this.createARecord(req);
    return {
      ...record,
      dateAssigned: req.body.dateAssigned,
      dueDate: req.body.dueDate,
    };
  }

  public save(req: ISecureRequest): Promise<Task> {
    const task = this.create(req);

    return Task.create({
      ...task,
      UserId: this.userId,
    });
  }

  public update(
    req: ISecureRequest,
    task: Task,
    complete: boolean
  ): Promise<Task> {
    const updatedTask = this.create(req);
    if (complete) updatedTask.complete = true;

    return task.update(updatedTask);
  }

  public delete(task: Task): Promise<void> {
    return task.destroy();
  }

  public completeTask(task: Task): Promise<Task> {
    return task.update({ complete: true });
  }
}
