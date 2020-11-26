import React, { useContext, useState } from 'react';
import Title from './Title';
import CurrentTasks from './Tables/CurrentTasks';
import TaskLog from './Tables/TaskLog';
import Spinner from './Spinner';
import { Logs, Tasks } from '../enums';
import { GlobalContext } from '../context/GlobalState';
import { Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
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

  return (
    <>
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
      {loading ? (
        <Spinner />
      ) : showLog ? (
        <>
          <TaskLog setLoading={setLoading} />
          <div className={classes.seeMore}>
            <Link
              color="primary"
              href="#"
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
          <CurrentTasks setLoading={setLoading} />
          {!showForm && !showCompleted && (
            <div className={classes.seeMore}>
              <Link
                color="primary"
                href="#"
                onClick={() =>
                  dispatch({ type: Tasks.setShowForm, payload: true })
                }
              >
                Create new task
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TasksComponent;
