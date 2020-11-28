import React from 'react';
import { IconButton } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import { getTasks, getLogs, deleteTask } from '../../global/functions/axios';
import { useContext } from 'react';
import { Alerts, Commands, Logs, Tasks } from '../../enums';
import {
  HandleActionType,
  ILog,
  ITask,
  MessageType,
} from '../../global/types/type';
import {
  Delete as DeleteIcon,
  LibraryBooks,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';

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

    try {
      if (command === Commands.DELETE && !showLog) {
        const responseData: MessageType = await deleteTask(projectNumber);

        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(state.tasks.showCompleted),
        });
        dispatch({ type: Alerts.setAlerts, payload: responseData });
      } else {
        dispatch({ type: Logs.setShowLog, payload: true });
        dispatch({ type: Logs.setLogs, payload: await getLogs(projectNumber) });
      }
      props.setLoading(false);
    } catch (err) {
      dispatch({ type: Alerts.setAlerts, payload: err.response.data });
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
