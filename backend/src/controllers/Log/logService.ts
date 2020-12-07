import { ISecureRequest } from '@overnightjs/jwt';
import { Log } from '../../models/models';
import { Record } from '../Record/record';

export class LogService extends Record {
  private id: number;
  private projectNumber: number | null;

  constructor(id: number, projectNumber: number | null = null) {
    super();
    this.id = id;
    this.projectNumber = projectNumber;
  }

  getLog(): Promise<Log[]> {
    return Log.findAll({
      where: { projectNumber: this.projectNumber, TaskId: this.id },
      order: [['id', 'DESC']],
    });
  }

  getLogItem(): Promise<Log | null> {
    return Log.findOne({ where: { id: this.id } });
  }

  getLatestLogs(taskId: number): Promise<Log[]> {
    return Log.findAll({
      where: { TaskId: taskId },
      order: [['id', 'DESC']],
      limit: 2,
    });
  }

  updateLogItem(req: ISecureRequest, log: Log): Promise<Log> {
    const updatedLog = this.createARecord(req);
    return log.update({
      ...updatedLog,
      loggedAt: req.body.loggedAt,
      TaskId: log.TaskId,
    });
  }
}
