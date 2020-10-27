import React, { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Title from './Title';
import { GlobalContext } from '../context/GlobalState';

function preventDefault(event: any) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
    depositContext: {
      flex: 1,
    },
  })
);

export default function Deposits() {
  const classes = useStyles();
  const { user } = useContext(GlobalContext).state;
  return (
    <React.Fragment>
      <Title>{user.firstName && `Good Morning ${user.firstName}`}</Title>
      <Typography component="p" variant="h4">
        Current Week
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        10/16/2020
      </Typography>
      <div className={classes.root}>
        <Pagination
          count={10}
          defaultPage={6}
          boundaryCount={3}
          siblingCount={0}
        />
      </div>
    </React.Fragment>
  );
}
