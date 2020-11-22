import React, { useContext, useState } from 'react';
import Title from './Title';
import CurrentTasks from './Tables/CurrentTasks';
import TaskLog from './Tables/TaskLog';
import Spinner from './Spinner';
import { Alert } from '@material-ui/lab';
import { Logs } from '../enums';
import { GlobalContext } from '../context/GlobalState';
import { AlertType, setAlertsAndGetTasksType } from '../type';
import { Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const TasksComponent: React.FC<{
  getTasks: () => void;
  showCompleted: boolean;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState<{
    success: AlertType;
    delete: AlertType;
    error: AlertType;
  }>({
    success: null,
    delete: null,
    error: null,
  });
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;
  const [loading, setLoading] = useState(false);

  const setAlertsAndGetTasks: setAlertsAndGetTasksType = (
    command,
    message,
    err = null
  ) => {
    if (!err) props.getTasks();

    setAlerts({ ...alerts, [command]: message });
    setTimeout(() => {
      setAlerts({ success: null, delete: null, error: null });
    }, 3000);
  };

  return (
    <>
      {alerts.error && (
        <Alert severity="error" role="alert">
          {alerts.error}
        </Alert>
      )}
      {alerts.success && (
        <Alert severity="success" role="alert">
          {alerts.success}
        </Alert>
      )}
      {alerts.delete && (
        <Alert severity="warning" role="alert">
          {alerts.delete}
        </Alert>
      )}

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
          <TaskLog
            setLoading={setLoading}
            setAlertsAndGetTasks={setAlertsAndGetTasks}
          />
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
        <CurrentTasks
          setLoading={setLoading}
          setAlertsAndGetTasks={setAlertsAndGetTasks}
        />
      )}
    </>
  );
};

export default TasksComponent;
