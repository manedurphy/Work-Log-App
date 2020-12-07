import { ISecureRequest } from '@overnightjs/jwt';
import { Task } from '../../models/models';
import { Record } from '../Record/record';

export class TaskService extends Record {
  private projectNumber: number | null;

  constructor(private userId: number, projectNumber: number | null = null) {
    super();
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

  public update(req: ISecureRequest, task: Task, complete: boolean): void {
    const updatedTask = this.create(req);
    if (complete) updatedTask.complete = true;

    task.update(updatedTask);
  }

  public delete(task: Task): void {
    task.destroy();
  }

  public completeTask(task: Task): void {
    task.update({ complete: true });
  }
}
