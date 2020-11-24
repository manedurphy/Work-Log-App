import React, { useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { getToken, GlobalContext } from '../../context/GlobalState';
import {
  HandleLogActionType,
  ILog,
  ITask,
  MessageType,
  SetAlertsAndHandleResponseType,
} from '../../type';
import { Logs } from '../../enums';

const Log: React.FC<{
  setAlertsAndHandleResponse: SetAlertsAndHandleResponseType;
  row: ITask | ILog;
}> = (props) => {
  const { dispatch } = useContext(GlobalContext);

  const handleAction: HandleLogActionType = async (e, logItemId, command) => {
    try {
      if (command === 'delete') {
        const res: AxiosResponse<MessageType> = await axios.delete(
          `api/task/log/${logItemId}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        props.setAlertsAndHandleResponse(
          'delete',
          res.data.message,
          'logs',
          props.row.projectNumber,
          null
        );
      } else {
        const res: AxiosResponse<ILog> = await axios.get(
          `/api/task/singleLog/${props.row.id}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        dispatch({ type: Logs.setLog, payload: res.data });
      }
    } catch (err) {
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
      <IconButton onClick={(e) => handleAction(e, props.row.id, 'delete')}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default Log;
