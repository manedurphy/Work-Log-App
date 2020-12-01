import React, { useContext, useState } from 'react';
import Title from './Title';
import CurrentTasks from './Tables/CurrentTasks';
import TaskLog from './Tables/TaskLog';
import Spinner from './UI/Spinner';
import { Logs, Tasks } from '../enums';
import { GlobalContext } from '../context/GlobalState';
import { Box, Fab, Fade, Link, makeStyles } from '@material-ui/core';
import SmallSpinner from './UI/SmallSpinner';
import { Add as AddIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  link: {
    cursor: 'pointer',
  },
}));

const TasksComponent: React.FC<{
  showCompleted: boolean;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;
  const { showForm, showCompleted } = state.tasks;
  const [loading, setLoading] = useState(false);
  const [loadingEditTask, setLoadingEditTask] = useState(false);

  return (
    <>
      <div className="task-box-header">
        <Title>
          {loading
            ? 'Loading'
            : props.showCompleted && !showLog
            ? 'Archive'
            : props.showCompleted && showLog
            ? 'Completed Task Log'
            : !props.showCompleted && showLog
            ? 'Task Log'
            : 'Current Tasks'}
        </Title>
        {loadingEditTask && <SmallSpinner />}
      </div>
      {loading && !loadingEditTask ? (
        <Spinner />
      ) : showLog ? (
        <>
          <TaskLog
            setLoading={setLoading}
            setLoadingEditTask={setLoadingEditTask}
          />
          <div className={classes.seeMore}>
            <Link
              className={classes.link}
              color="primary"
              onClick={() =>
                dispatch({ type: Logs.setShowLog, payload: false })
              }
            >
              See more tasks
            </Link>
          </div>
        </>
      ) : (
        <>
          <CurrentTasks
            setLoading={setLoading}
            setLoadingEditTask={setLoadingEditTask}
          />
          {!showForm && !showCompleted && (
            <Box
              display="flex"
              justifyContent="flex-end"
              className={classes.seeMore}
            >
              <Fade in={!showForm} timeout={500} enter>
                <Fab
                  color="primary"
                  size="small"
                  onClick={() =>
                    dispatch({ type: Tasks.setShowForm, payload: true })
                  }
                >
                  <AddIcon />
                </Fab>
              </Fade>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default TasksComponent;
