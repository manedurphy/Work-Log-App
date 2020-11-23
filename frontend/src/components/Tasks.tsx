import React, { useContext, useState } from 'react';
import Title from './Title';
import CurrentTasks from './Tables/CurrentTasks';
import TaskLog from './Tables/TaskLog';
import Spinner from './Spinner';
import { Alert } from '@material-ui/lab';
import { Logs } from '../enums';
import { GlobalContext } from '../context/GlobalState';
import { AlertType, SetAlertsAndHandleResponseType } from '../type';
import { Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const TasksComponent: React.FC<{
  getTasks: () => Promise<void>;
  getLogs: (projectNumber: number) => Promise<void>;
  showCompleted: boolean;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<{
    success: AlertType;
    delete: AlertType;
    error: AlertType;
  }>({
    success: null,
    delete: null,
    error: null,
  });

  const setAlertsAndHandleResponse: SetAlertsAndHandleResponseType = (
    command,
    message,
    target,
    projectNumber,
    err = null
  ) => {
    if (!err && target === 'tasks') props.getTasks();
    if (!err && target === 'logs' && projectNumber)
      props.getLogs(projectNumber);

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
            setAlertsAndHandleResponse={setAlertsAndHandleResponse}
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
          setAlertsAndHandleResponse={setAlertsAndHandleResponse}
        />
      )}
    </>
  );
};

export default TasksComponent;
