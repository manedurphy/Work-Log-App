import React, { useContext } from 'react';
import { CheckBox as CheckBoxIcon } from '@material-ui/icons';
import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';

const useStyles = makeStyles((theme) => ({
  worked: {
    backgroundColor: 'green',
    color: 'white',
    padding: '5px',
    borderRadius: '100%',
    width: '35px',
    position: 'absolute',
    right: 10,
    top: 10,
  },
}));

const Calendar: React.FC<{
  paper: string;
  alignText: string;
}> = (props): JSX.Element => {
  const { state } = useContext(GlobalContext);
  const classes = useStyles();
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Paper className={props.paper}>
        <h4 className={props.alignText}>Hours Worked</h4>
        <p>13 hours this week</p>
        <Box className={classes.worked}>
          <CheckBoxIcon />
        </Box>
      </Paper>
    </Grid>
  );
};

export default Calendar;
