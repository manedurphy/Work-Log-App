import React, { useContext, useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Title from './Title';
import CurrentTasks from './Tables/CurrentTasks';
import TaskLog from './Tables/TaskLog';
import Spinner from './Spinner';
import { Alert } from '@material-ui/lab';
import { Tasks, Logs } from '../enums';
import { getToken, GlobalContext } from '../context/GlobalState';
import { AlertType, ITask, MessageType, ILog } from '../type';
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
  const { currentTasks } = state.tasks;
  const { currentLog } = state.log;
  const [showBody, setShowBody] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    currentTasks.length ? setShowBody(true) : setShowBody(false);
  }, [currentTasks]);

  const setAlertsAndGetTasks = (
    command: string,
    message: string,
    err: Error | null = null
  ) => {
    if (!err) props.getTasks();

    setAlerts({ ...alerts, [command]: message });
    setTimeout(() => {
      setAlerts({ success: null, delete: null, error: null });
    }, 3000);
  };

  const handleAction = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number,
    command: string
  ) => {
    e.preventDefault();
    setLoading(true);
    let res: AxiosResponse<MessageType>;
    const token = getToken();

    try {
      if (command === 'success') {
        const task: AxiosResponse<ITask> = await axios.get(
          `api/task/${projectNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        task.data.complete = true;

        res = await axios.put(`api/task/${projectNumber}`, task.data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlertsAndGetTasks(command, res.data.message);
      } else if (command === 'delete') {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAlertsAndGetTasks(command, res.data.message);
      } else if (command === 'log') {
        setShowLog(true);
        const log: AxiosResponse<ILog[]> = await axios.get(
          `api/task/log/${projectNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch({ type: Logs.setLog, payload: log.data });
      } else {
        const task = await axios.get(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch({ type: Tasks.updateTask, payload: task.data });
      }
      setLoading(false);
    } catch (err) {
      setAlertsAndGetTasks('error', err.response.data.message, err);
    }
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
            showCompleted={props.showCompleted}
            taskLog={currentLog}
            handleAction={handleAction}
            showLog={showLog}
          />
          <div className={classes.seeMore}>
            <Link color="primary" href="#" onClick={() => setShowLog(false)}>
              See more tasks
            </Link>
          </div>
        </>
      ) : (
        <CurrentTasks
          showBody={showBody}
          showCompleted={props.showCompleted}
          currentTasks={currentTasks}
          handleAction={handleAction}
          showLog={showLog}
        />
      )}
    </>
  );
};

export default TasksComponent;
