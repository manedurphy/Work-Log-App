import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { IconButton } from '@material-ui/core';
import {
  Delete as DeleteIcon,
  LibraryBooks,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { GlobalContext } from '../../context/GlobalState';
import { getTasks, getToken, getLogs } from '../../globalFunctions';
import { useContext } from 'react';
import { Alerts, Logs, Tasks } from '../../enums';
import { HandleActionType, ILog, ITask, MessageType } from '../../type';

const CompletedTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setModify: React.Dispatch<React.SetStateAction<boolean>>;
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
      if (command === 'delete' && !showLog) {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(state.tasks.showCompleted),
        });
        dispatch({ type: Alerts.setAlerts, payload: res.data });
        setTimeout(() => {
          dispatch({ type: Alerts.removeAlerts, payload: [] });
        }, 3000);
      } else {
        dispatch({ type: Logs.setShowLog, payload: true });
        dispatch({ type: Logs.setLogs, payload: await getLogs(projectNumber) });
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
        onClick={(e) => handleAction(e, props.row.projectNumber, 'delete')}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'log')}
      >
        <LibraryBooks />
      </IconButton>
      <IconButton onClick={() => props.setModify(false)}>
        <ChevronRightIcon />
      </IconButton>
    </>
  );
};

export default CompletedTasks;
