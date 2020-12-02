import React, { useState, useContext } from 'react';
import DeleteModal from '../UI/DeleteModal';
import { IconButton } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import { deleteLog, getLog, getLogs } from '../../global/functions/axios';
import { Alerts, Commands, Logs } from '../../enums';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import {
  HandleLogActionType,
  ILog,
  MessageType,
} from '../../global/types/type';

const LogActions: React.FC<{
  row: ILog;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const { dispatch } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleAction: HandleLogActionType = async (e, logItemId, command) => {
    try {
      if (command === Commands.DELETE) {
        const responseData: MessageType = await deleteLog(logItemId);

        dispatch({
          type: Logs.setLogs,
          payload: await getLogs(props.row.projectNumber),
        });
        dispatch({ type: Alerts.setAlerts, payload: responseData });
      } else {
        props.setLoadingEditTask(true);
        const responseData: ILog = await getLog(props.row.id);
        dispatch({ type: Logs.setLog, payload: responseData });
        props.setLoadingEditTask(false);
      }
    } catch (err) {
      //TEST THIS ERROR LATER
      dispatch({ type: Alerts.setAlerts, payload: err.response.data });
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
      <IconButton color="secondary" onClick={() => setOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <DeleteModal
        id={props.row.id}
        open={open}
        handleClose={handleClose}
        handleAction={handleAction}
      />
    </>
  );
};

export default LogActions;
