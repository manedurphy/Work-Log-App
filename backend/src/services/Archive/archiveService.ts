import { Task } from '../../models/models';

export class ArchiveService {
  private id: number;
  private complete: boolean;

  constructor(id: number, complete: boolean) {
    this.id = id;
    this.complete = complete;
  }

  public getCompletedTasks(): Promise<Task[]> {
    return Task.findAll({
      where: { UserId: this.id, complete: this.complete },
      order: [['id', 'DESC']],
    });
  }

  // public static getCompletedTasks: GetCompletedTasksType = async (
  //   userId,
  //   complete
  // ) =>
  //   await Task.findAll({
  //     where: { UserId: userId, complete },
  //     order: [['id', 'DESC']],
  //   });
}
