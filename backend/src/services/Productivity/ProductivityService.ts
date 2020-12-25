import { Productivity } from '../../models/models';
import * as moment from 'moment-timezone';
import { Op } from 'sequelize';

export class ProductivityService {
  private hours: number;
  private logId: number;
  private date: string;
  private day: number;
  private userId: number;

  constructor(
    hours: number,
    logId: number,
    userId: number,
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
    this.userId = userId;
  }

  public create(): Promise<Productivity> {
    return Productivity.create({
      day: this.day,
      weekOf: this.date.slice(0, 10),
      hours: this.hours,
      LogId: this.logId,
      UserId: this.userId,
    });
  }

  public formatDate(date: Date): Date {
    return new Date(moment(date).tz('America/Los_Angeles').format());
  }

  public getSunday(d: Date): string {
    const sunday = new Date();
    sunday.setDate(d.getDate() - (d.getDay() || 7));

    return moment(sunday).tz('America/Los_Angeles').format();
  }

  public async compareProductivity() {
    const today = new Date();
    const currentSunday = this.date;
    const lastSunday = moment(
      new Date().setDate(today.getDate() - (today.getDay() || 7) - 7)
    )
      .tz('America/Los_Angeles')
      .format();

    const hoursThisWeek =
      (await Productivity.sum('hours', {
        where: {
          weekOf: currentSunday.slice(0, 10),
          UserId: this.userId,
          day: {
            [Op.lte]: this.day,
          },
        },
      })) || 0;

    const hoursLastWeek =
      (await Productivity.sum('hours', {
        where: {
          weekOf: lastSunday.slice(0, 10),
          UserId: this.userId,
          day: {
            [Op.lte]: this.day,
          },
        },
      })) || 0;

    let calc: number;

    if (hoursThisWeek < hoursLastWeek) {
      calc = 100 - (hoursThisWeek / (hoursLastWeek || 1)) * 100;
      return { percent: calc, status: 'decrease', color: 'red' };
    } else if (hoursThisWeek > hoursLastWeek) {
      calc = (hoursThisWeek / (hoursLastWeek || 1)) * 100;
      return { percent: calc, status: 'increase', color: 'green' };
    } else {
      return { percent: 0, status: 'increase', color: 'blue' };
    }
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
