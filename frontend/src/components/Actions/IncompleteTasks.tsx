import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { IconButton } from '@material-ui/core';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
} from '@material-ui/icons';
import { HandleActionType, ILog, ITask, MessageType } from '../../type';
import { getToken, GlobalContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { Logs, Tasks } from '../../enums';

const IncompleteTasks = ({ props }: any) => {
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
        props.setAlertsAndGetTasks(command, res.data.message);
      } else if (command === 'delete' && !showLog) {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        props.setAlertsAndGetTasks(command, res.data.message);
      } else if (command === 'log') {
        dispatch({ type: Logs.setShowLog, payload: true });
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
      props.setLoading(false);
    } catch (err) {
      props.setAlertsAndGetTasks('error', err.response.data.message, err);
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
