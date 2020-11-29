import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { IconButton } from '@material-ui/core';
import { Alerts, Commands, Logs, Tasks } from '../../enums';
import {
  HandleActionType,
  ILog,
  ITask,
  MessageType,
} from '../../global/types/type';
import {
  completeTask,
  deleteTask,
  getLogs,
  getTask,
  getTasks,
} from '../../global/functions/axios';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';

const IncompleteTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setModify: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  row: ITask | ILog;
}> = (props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;

  const handleAction: HandleActionType = async (e, projectNumber, command) => {
    e.preventDefault();
    let responseData: MessageType;

    try {
      if (command === Commands.SUCCESS) {
        props.setLoading(true);
        responseData = await completeTask(projectNumber);

        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(state.tasks.showCompleted),
        });
        dispatch({ type: Alerts.setAlerts, payload: responseData });
        props.setLoading(false);
      } else if (command === Commands.DELETE && !showLog) {
        props.setLoading(true);
        responseData = await deleteTask(projectNumber);
        dispatch({
          type: Tasks.updateTasks,
          payload: await getTasks(state.tasks.showCompleted),
        });
        dispatch({ type: Alerts.setAlerts, payload: responseData });
        props.setLoading(false);
      } else if (command === Commands.LOG) {
        props.setLoading(true);
        dispatch({ type: Logs.setShowLog, payload: true });
        dispatch({ type: Logs.setLogs, payload: await getLogs(projectNumber) });
        props.setLoading(false);
      } else {
        props.setLoadingEditTask(true);
        dispatch({
          type: Tasks.updateTask,
          payload: await getTask(projectNumber),
        });
        props.setLoadingEditTask(false);
      }
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
        onClick={(e) => handleAction(e, props.row.projectNumber, Commands.EDIT)}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={(e) =>
          handleAction(e, props.row.projectNumber, Commands.DELETE)
        }
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={(e) =>
          handleAction(e, props.row.projectNumber, Commands.SUCCESS)
        }
      >
        <CheckCircleOutlineIcon />
      </IconButton>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, Commands.LOG)}
      >
        <LibraryBooks />
      </IconButton>
      <IconButton onClick={() => props.setModify(false)}>
        <ChevronRightIcon />
      </IconButton>
    </>
  );
};

export default IncompleteTasks;
