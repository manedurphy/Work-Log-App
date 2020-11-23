import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Title from "./Title";
import { GlobalContext } from "../context/GlobalState";
import Date from "./Date";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& > *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const Deposits = () => {
  const classes = useStyles();
  const { user } = useContext(GlobalContext).state;
  return (
    <React.Fragment>
      <Title>{user.firstName && `Good Morning ${user.firstName}`}</Title>
      <Typography component="p" variant="h4">
        Current Week
      </Typography>
      <Date />
      <Typography>Top prioritity:</Typography>
      <div className={classes.root}>
        <Pagination
          count={5}
          defaultPage={1}
          boundaryCount={3}
          siblingCount={0}
        />
      </div>
    </React.Fragment>
  );
};

export default Deposits;
