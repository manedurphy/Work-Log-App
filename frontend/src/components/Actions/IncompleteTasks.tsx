import React, { useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { IconButton } from '@material-ui/core';
import { getToken, GlobalContext } from '../../context/GlobalState';
import { Logs, Tasks } from '../../enums';
import {
  HandleActionType,
  ILog,
  ITask,
  MessageType,
  SetAlertsAndHandleResponseType,
} from '../../type';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
} from '@material-ui/icons';

const IncompleteTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertsAndHandleResponse: SetAlertsAndHandleResponseType;
  row: ITask | ILog;
}> = (props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;

  const handleAction: HandleActionType = async (e, projectNumber, command) => {
    e.preventDefault();
    props.setLoading(true);
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
        props.setAlertsAndHandleResponse(
          command,
          res.data.message,
          'tasks',
          null,
          null
        );
      } else if (command === 'delete' && !showLog) {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        props.setAlertsAndHandleResponse(
          command,
          res.data.message,
          'tasks',
          props.row.projectNumber,
          null
        );
      } else if (command === 'log') {
        dispatch({ type: Logs.setShowLog, payload: true });
        const log: AxiosResponse<ILog[]> = await axios.get(
          `api/log/task/${projectNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch({ type: Logs.setLogs, payload: log.data });
      } else {
        const task = await axios.get(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch({ type: Tasks.updateTask, payload: task.data });
      }
      props.setLoading(false);
    } catch (err) {
      //TEST THIS ERR LATER
      props.setAlertsAndHandleResponse(
        'error',
        err.response.data.message,
        null,
        null,
        err
      );
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
