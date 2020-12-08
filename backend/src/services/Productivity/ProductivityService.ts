import { Productivity } from '../../models/models';
import * as moment from 'moment-timezone';

export class ProductivityService {
  private hours: number;
  private logId: number;
  private date: string;
  private day: number;

  constructor(hours: number, logId: number, date: Date | null = null) {
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

  public create(): Promise<Productivity> {
    return Productivity.create({
      day: this.day,
      weekOf: this.date.slice(0, 10),
      hours: this.hours,
      LogId: this.logId,
    });
  }

  public formatDate(date: Date): Date {
    return new Date(moment(date).tz('America/Los_Angeles').format());
  }

  public getSunday(d: Date): string {
    const Sunday = new Date();
    Sunday.setDate(d.getDate() - (d.getDay() || 7));

    return moment(Sunday).tz('America/Los_Angeles').format();
  }

  public async compareProductivity() {
    const today = new Date();
    const currentSunday = this.date;
    const lastSunday = moment(
      new Date().setDate(today.getDate() - (today.getDay() || 7) - 7)
    )
      .tz('America/Los_Angeles')
      .format();

    const hoursThisWeek = await Productivity.sum('hours', {
      where: {
        weekOf: currentSunday.slice(0, 10),
      },
    });

    const hoursLastWeek = await Productivity.sum('hours', {
      where: {
        weekOf: lastSunday.slice(0, 10),
      },
    });

    return (hoursThisWeek / hoursLastWeek) * 100;
  }

  public async update(): Promise<void> {
    const prodInstance = await Productivity.findOne({
      where: {
        LogId: this.logId,
      },
    });

    prodInstance?.update({
      hours: this.hours,
      LogId: this.logId,
      weekOf: this.date.slice(0, 10),
      day: this.day,
    });
  }
}
