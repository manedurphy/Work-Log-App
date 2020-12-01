import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { getDateAndTime } from '../global/functions/helpers';

const Date = () => {
  const [date, setDate] = useState(getDateAndTime());
  useEffect(() => {
    const interval = setInterval(() => setDate(getDateAndTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <Typography color="textSecondary">{date}</Typography>;
};

export default Date;
