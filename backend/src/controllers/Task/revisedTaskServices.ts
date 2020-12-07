import { ISecureRequest } from '@overnightjs/jwt';
import { Task } from '../../models/models';
import { Record } from '../Record/record';

export class RevisedTaskServices {
  private projectNumber: number | null;

  constructor(private userId: number, projectNumber: number | null = null) {
    this.projectNumber = projectNumber;
  }

  getTask = async (): Promise<Task | null> => {
    return Task.findOne({
      where: {
        projectNumber: this.projectNumber,
        UserId: this.userId,
      },
    });
  };

  getTasks = async (complete: boolean): Promise<Task[] | null> => {
    return Task.findAll({
      where: { UserId: this.userId, complete },
      order: [['id', 'DESC']],
    });
  };

  create(req: ISecureRequest) {
    const record = Record.createRecord(req);
    return {
      ...record,
      dateAssigned: req.body.dateAssigned,
      dueDate: req.body.dueDate,
    };
  }

  save = async (req: ISecureRequest): Promise<Task> => {
    const task = this.create(req);

    return Task.create({
      ...task,
      UserId: this.userId,
    });
  };

  update = async (
    req: ISecureRequest,
    task: Task,
    complete: boolean
  ): Promise<void> => {
    const updatedTask = this.create(req);
    if (complete) updatedTask.complete = true;

    task.update(updatedTask);
  };

  delete = async (task: Task): Promise<void> => {
    task.destroy();
  };

  completeTask = async (task: Task): Promise<void> => {
    task.update({ complete: true });
  };
}
