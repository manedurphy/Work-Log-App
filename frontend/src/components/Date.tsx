import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { getDate } from '../global/functions/helpers';

const Date = () => {
  const [date, setDate] = useState(getDate());

  setInterval(() => setDate(getDate()), 1000);
  return <Typography color="textSecondary">{date}</Typography>;
};

export default Date;
