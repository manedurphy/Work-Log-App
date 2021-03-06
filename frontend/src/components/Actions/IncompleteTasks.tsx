import React, { useContext, useState } from 'react';
import DeleteModal from '../UI/DeleteModal';
import { GlobalContext } from '../../context/GlobalState';
import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
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
} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: 'green',
    },
    button: {
      color: 'purple',
    },
  })
);

const IncompleteTasks: React.FC<{
  row: ITask | ILog;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

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
        color="primary"
        onClick={(e) => handleAction(e, props.row.projectNumber, Commands.EDIT)}
      >
        <EditIcon />
      </IconButton>
      <IconButton color="secondary" onClick={(e) => setOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <IconButton
        className={classes.root}
        onClick={(e) =>
          handleAction(e, props.row.projectNumber, Commands.SUCCESS)
        }
      >
        <CheckCircleOutlineIcon />
      </IconButton>
      <IconButton
        className={classes.button}
        onClick={(e) => handleAction(e, props.row.projectNumber, Commands.LOG)}
      >
        <LibraryBooks />
      </IconButton>
      <DeleteModal
        id={props.row.projectNumber}
        open={open}
        handleClose={handleClose}
        handleAction={handleAction}
      />
    </>
  );
};

export default IncompleteTasks;
