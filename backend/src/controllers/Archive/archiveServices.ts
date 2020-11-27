import { Task } from '../../models/models';
import { GetCompletedTasksType } from './types';

export class ArchiveServices {
  public static getCompletedTasks: GetCompletedTasksType = async (
    userId,
    complete
  ) =>
    await Task.findAll({
      where: { UserId: userId, complete },
      order: [['id', 'DESC']],
    });
}
