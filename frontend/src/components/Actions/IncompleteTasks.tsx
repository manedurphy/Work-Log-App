import React, { useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { IconButton } from '@material-ui/core';
import {
  getLogs,
  getTasks,
  getToken,
  GlobalContext,
} from '../../context/GlobalState';
import { Alerts, Logs, Tasks } from '../../enums';
import { HandleActionType, ILog, ITask, MessageType } from '../../type';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
} from '@material-ui/icons';

const IncompleteTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  row: ITask | ILog;
}> = (props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;

  const handleAction: HandleActionType = async (e, projectNumber, command) => {
    e.preventDefault();
    props.setLoading(true);
    let res: AxiosResponse<MessageType>;

    try {
      if (command === 'success') {
        const task: AxiosResponse<ITask> = await axios.get(
          `api/task/${projectNumber}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        task.data.complete = true;

        res = await axios.put(`api/task/${projectNumber}`, task.data, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(state.tasks.showCompleted),
        });
        dispatch({ type: Alerts.setAlerts, payload: res.data });
        setTimeout(() => {
          dispatch({ type: Alerts.removeAlerts, payload: [] });
        }, 3000);
      } else if (command === 'delete' && !showLog) {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(state.tasks.showCompleted),
        });
        dispatch({ type: Alerts.setAlerts, payload: res.data });
        setTimeout(() => {
          dispatch({ type: Alerts.removeAlerts, payload: [] });
        }, 3000);
      } else if (command === 'log') {
        dispatch({ type: Logs.setShowLog, payload: true });
        dispatch({ type: Logs.setLogs, payload: await getLogs(projectNumber) });
      } else {
        const task = await axios.get(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        dispatch({ type: Tasks.updateTask, payload: task.data });
      }
      props.setLoading(false);
    } catch (err) {
      dispatch({ type: Alerts.setAlerts, payload: err.response.data.message });
      setTimeout(() => {
        dispatch({ type: Alerts.removeAlerts, payload: [] });
      }, 3000);
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'edit')}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'delete')}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'success')}
      >
        <CheckCircleOutlineIcon />
      </IconButton>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'log')}
      >
        <LibraryBooks />
      </IconButton>
    </>
  );
};

export default IncompleteTasks;
