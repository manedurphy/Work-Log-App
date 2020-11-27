import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import { deleteLog, getLog, getLogs } from '../../global/functions/axios';
import {
  HandleLogActionType,
  ILog,
  MessageType,
} from '../../global/types/type';
import { Alerts, Commands, Logs } from '../../enums';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';

const LogActions: React.FC<{
  row: ILog;
  setModify: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const { dispatch } = useContext(GlobalContext);

  const handleAction: HandleLogActionType = async (e, logItemId, command) => {
    try {
      if (command === Commands.DELETE) {
        const responseData: MessageType = await deleteLog(logItemId);

        dispatch({
          type: Logs.setLogs,
          payload: await getLogs(props.row.projectNumber),
        });
        dispatch({ type: Alerts.setAlerts, payload: responseData });
        setTimeout(() => {
          dispatch({ type: Alerts.removeAlerts, payload: [] });
        }, 3000);
      } else {
        const responseData: ILog = await getLog(props.row.id);
        dispatch({ type: Logs.setLog, payload: responseData });
      }
    } catch (err) {
      //TEST THIS ERROR LATER
      dispatch({ type: Alerts.setAlerts, payload: err.response.data });
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
        onClick={(e) => handleAction(e, props.row.id, Commands.DELETE)}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton onClick={(e) => props.setModify(false)}>
        <ChevronRightIcon />
      </IconButton>
    </>
  );
};

export default LogActions;
