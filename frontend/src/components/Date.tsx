import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { getDate } from '../global/functions/helpers';

const Date = () => {
  const [date, setDate] = useState(getDate());
  useEffect(() => {
    const interval = setInterval(() => setDate(getDate()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <Typography color="textSecondary">{date}</Typography>;
};

export default Date;
