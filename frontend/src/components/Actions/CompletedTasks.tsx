import React, { useState } from 'react';
import DeleteModal from '../UI/DeleteModal';
import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
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
import { Delete as DeleteIcon, LibraryBooks } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    log: {
      color: 'purple',
    },
  })
);

const CompletedTasks: React.FC<{
  row: ITask | ILog;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

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
      <IconButton color="secondary" onClick={() => setOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <IconButton
        className={classes.log}
        onClick={(e) => handleAction(e, props.row.projectNumber, 'log')}
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

export default CompletedTasks;
