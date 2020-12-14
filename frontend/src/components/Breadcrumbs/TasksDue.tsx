import React, { useContext } from 'react';
import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import { FormatListBulleted as FormatListBulletedIcon } from '@material-ui/icons';
import { GlobalContext } from '../../context/GlobalState';

const useStyles = makeStyles((theme) => ({
  due: {
    backgroundColor: 'purple',
    color: 'white',
    padding: '5px',
    borderRadius: '100%',
    width: '35px',
    position: 'absolute',
    right: 10,
    top: 10,
  },
}));

const TasksDue: React.FC<{
  paper: string;
  alignText: string;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const { state } = useContext(GlobalContext);
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Paper className={props.paper}>
        <h4 className={props.alignText}>Tasks Due</h4>
        <p>You have {state.date.tasksDue.length} tasks due today</p>
        <Box className={classes.due}>
          <FormatListBulletedIcon />
        </Box>
      </Paper>
    </Grid>
  );
};

export default TasksDue;
