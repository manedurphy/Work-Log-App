import { Productivity } from '../../models/models';
import * as moment from 'moment-timezone';

export class ProductivityService {
  private day: number;
  private date: string;

  constructor(
    private hours: number,
    private logId: number,
    date: Date | null = null
  ) {
    if (date) {
      this.day = this.formatDate(date).getDay();
      this.date = this.getSunday(date);
    } else {
      this.day = new Date().getDay();
      this.date = this.getSunday(new Date());
    }
    this.hours = hours;
    this.logId = logId;
  }

  create(): void {
    Productivity.create({
      day: this.day,
      weekOf: this.date.slice(0, 10),
      hours: this.hours,
      LogId: this.logId,
    });
  }

  formatDate(date: Date): Date {
    return new Date(moment(date).tz('America/Los_Angeles').format());
  }

  getSunday(d: Date): string {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 1);

    return moment(new Date(new Date(d.setDate(diff))))
      .tz('America/Los_Angeles')
      .format();
  }

  update = async (): Promise<void> => {
    const prodInstance = await Productivity.findOne({
      where: {
        LogId: this.logId,
      },
    });

    prodInstance?.update({
      day: this.day,
      weekOf: this.date.slice(0, 10),
      hours: this.hours,
      LogId: this.logId,
    });
  };
}
