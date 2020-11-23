import React, { useState } from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    depositContext: {
      flex: 1,
    },
  })
);

const getDate = () => moment().format("MMMM Do YYYY , h:mm:ss a");

const Date = () => {
  const [date, setDate] = useState(getDate());
  const classes = useStyles();

  setInterval(() => setDate(getDate()), 1000);
  return (
    <>
      <Typography color="textSecondary">{date}</Typography>
    </>
  );
};

export default Date;
