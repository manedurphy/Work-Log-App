import * as moment from 'moment-timezone';

export const getSunday = (d: Date): string => {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 1);

  return moment(new Date(new Date(d.setDate(diff))))
    .tz('America/Los_Angeles')
    .format();
};
