import React, { useContext } from 'react';
import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Work as WorkIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  productivity: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '5px',
    borderRadius: '100%',
    width: '35px',
    position: 'absolute',
    right: 10,
    top: 10,
  },
}));

const Productivity: React.FC<{ paper: string; alignText: string }> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { state } = useContext(GlobalContext);
  return (
    <Grid item xs={12} md={3}>
      <Paper className={props.paper}>
        <h4 className={props.alignText}>Productivity</h4>
        {state.productivity.status !== 'unavailable' ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            {state.productivity.status === 'increase' ? (
              <ArrowUpwardIcon style={{ color: state.productivity.color }} />
            ) : (
              <ArrowDownwardIcon style={{ color: state.productivity.color }} />
            )}
            <p
              style={{
                color: state.productivity.color,
                marginRight: '5px',
              }}
            >
              {state.productivity.percent}%
            </p>
            <p>Since last week</p>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <p>Calcluating...</p>
          </Box>
        )}
        <Box className={classes.productivity}>
          <WorkIcon />
        </Box>
      </Paper>
    </Grid>
  );
};

export default Productivity;
