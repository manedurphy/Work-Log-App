import { ISecureRequest } from '@overnightjs/jwt';
import { Log, Task } from '../../models/models';
import { Record } from '../Record/record';

export class LogService extends Record {
  private id: number;
  private projectNumber: number | null;

  constructor(id: number, projectNumber: number | null = null) {
    super();
    this.id = id;
    this.projectNumber = projectNumber;
  }

  public getLog(): Promise<Log[]> {
    return Log.findAll({
      where: { projectNumber: this.projectNumber, TaskId: this.id },
      order: [['id', 'DESC']],
    });
  }

  public getMostRecentLogItem(): Promise<Log | null> {
    return Log.findOne({
      where: { projectNumber: this.projectNumber, TaskId: this.id },
      order: [['id', 'DESC']],
    });
  }

  public getLogItem(): Promise<Log | null> {
    return Log.findOne({ where: { id: this.id } });
  }

  public getLatestLogs(taskId?: number): Promise<Log[]> {
    return Log.findAll({
      where: { TaskId: taskId || this.id },
      order: [['id', 'DESC']],
      limit: 2,
    });
  }

  public updateLogItem(req: ISecureRequest, log: Log): Promise<Log> {
    const updatedLog = this.createARecord(req);
    return log.update({
      ...updatedLog,
      loggedAt: req.body.loggedAt,
      TaskId: log.TaskId,
    });
  }

  public createLogItem(req: ISecureRequest, complete: boolean): Promise<Log> {
    const log = this.createARecord(req);
    if (complete) log.complete = true;

    return Log.create({
      ...log,
      loggedAt: req.body.loggedAt || new Date(),
      TaskId: this.id,
    });
  }

  public updateCompleteStatus(log: Log): Promise<Log> {
    return log.update({ complete: true });
  }
}
