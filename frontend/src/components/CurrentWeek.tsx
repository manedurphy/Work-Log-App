import React, { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Title from './Title';
import { GlobalContext } from '../context/GlobalState';
import Date from './Date';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
    depositContext: {
      flex: 1,
      color: 'grey',
    },
  })
);

const Deposits = () => {
  const classes = useStyles();
  const { user, tasks } = useContext(GlobalContext).state;
  return (
    <>
      <Title>{user.firstName && `Good Morning ${user.firstName}`}</Title>
      <Typography component="p" variant="h6">
        Today
        <Date />
      </Typography>
      <Typography className={classes.depositContext}>
        Due: "{tasks.currentTasks[0] && tasks.currentTasks[0].name}" (not
        complete)
      </Typography>
      <div className={classes.root}>
        <Pagination
          count={5}
          defaultPage={1}
          boundaryCount={3}
          siblingCount={0}
        />
      </div>
    </>
  );
};

export default Deposits;
