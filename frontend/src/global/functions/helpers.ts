import moment from 'moment-timezone';
import { Dates } from '../../enums';
import { ITask, ITaskForm } from '../types/type';

export const hoursRemaining = (formData: ITaskForm): boolean => {
  return (
    +formData.hoursAvailableToWork -
      +formData.hoursWorked -
      +formData.reviewHours -
      +formData.hoursRequiredByBim >
    0
  );
};

export const getDateAndTime = () => moment().format('MMMM Do YYYY , h:mm:ss a');
export const getDispatchDate = () => moment().format().slice(0, 10);
export const getFormDate = () =>
  moment()
    .format()
    .slice(0, moment().format().length - 9);

export const getFormattedDate = (
  command: string,
  value: number,
  date: string
) => {
  if (command === Dates.ADD) {
    return moment(date).add(value, Dates.DAYS).format().slice(0, 10);
  }

  return moment(date).subtract(value, Dates.DAYS).format().slice(0, 10);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getFilterTasksDue = (tasks: ITask[], date: string) =>
  tasks.filter((task) => task.dueDate.slice(0, 10) === date && task);
