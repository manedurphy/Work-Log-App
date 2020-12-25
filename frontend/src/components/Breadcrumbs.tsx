import React from 'react';
import Weather from './Breadcrumbs/Weather';
import { Grid, makeStyles } from '@material-ui/core';

import TasksDue from './Breadcrumbs/TasksDue';
import Productivity from './Breadcrumbs/Productivity';
import HoursWorked from './Breadcrumbs/HoursWorked';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    zIndex: theme.zIndex.drawer + 10,
    position: 'relative',
    marginBottom: theme.spacing(3),
    height: '80px',
    alignItems: 'center',
  },
  alignText: {
    textAlign: 'center',
  },
}));

const Breadcrumbs = (): JSX.Element => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Weather paper={classes.paper} />
        <TasksDue paper={classes.paper} alignText={classes.alignText} />
        <Productivity paper={classes.paper} alignText={classes.alignText} />
        {/* <Grid item xs={12} md={6} lg={3}>
          <Paper className={classes.paper}>Here is a component</Paper>
        </Grid> */}
        <HoursWorked paper={classes.paper} alignText={classes.alignText} />
      </Grid>
    </React.Fragment>
  );
};

export default Breadcrumbs;
